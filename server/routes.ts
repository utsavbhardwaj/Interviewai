import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { z } from "zod";
import { insertInterviewSchema, updateInterviewSchema } from "@shared/schema";
import { generateInterviewQuestions, generateInterviewResponse, analyzeFeedback } from "./services/gemini.js";
import multer from "multer";
import cors from "cors";
import crypto from "crypto";
import { uploadToS3 } from "./services/s3.js";
import { parseDocument } from "./services/document-parser.js";
import { getCache, setCache } from "./services/redis.js";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.use(
    cors({
      origin: process.env.NODE_ENV === "production"
        ? "https://interviewai-v52b.onrender.com"
        : ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"]
    })
  );
  
  // Get or create a demo user
  let demoUser = await storage.getUserByUsername("demo");
  if (!demoUser) {
    demoUser = await storage.createUser({
      username: "demo",
      email: "demo@example.com",
      password: "demo123"
    });
  }

  // Get all interviews for demo user
  app.get("/api/interviews", async (req, res) => {
    try {
      const interviews = await storage.getInterviewsByUserId(demoUser.id);
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  // Get specific interview
  app.get("/api/interviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const interview = await storage.getInterview(id);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interview" });
    }
  });

  // Create new interview
  app.post("/api/interviews", upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jobDescription", maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { jobTitle, company, jobDescriptionText: pastedJobDescriptionText } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      
      const resumeFile = files && files["resume"] ? files["resume"][0] : null;
      const jobDescFile = files && files["jobDescription"] ? files["jobDescription"][0] : null;

      if (!resumeFile) {
        return res.status(400).json({ message: "Resume file is required" });
      }

      if (!jobDescFile && !pastedJobDescriptionText) {
        return res.status(400).json({ message: "Job description (either file upload or pasted text) is required" });
      }

      // 1. Upload resume to S3 or local disk fallback
      const resumeUrl = await uploadToS3(resumeFile, "resumes");
      const resumeText = await parseDocument(
        resumeFile.buffer,
        resumeFile.mimetype,
        resumeFile.originalname
      );
      const resumeBase64 = resumeFile.buffer.toString('base64');

      // 2. Handle Job Description (File upload vs pasted text)
      let jobDescriptionText = "";
      let jobDescriptionUrl = "";
      let jobDescriptionBase64 = "";

      if (jobDescFile) {
        jobDescriptionUrl = await uploadToS3(jobDescFile, "job-descriptions");
        jobDescriptionText = await parseDocument(
          jobDescFile.buffer,
          jobDescFile.mimetype,
          jobDescFile.originalname
        );
        jobDescriptionBase64 = jobDescFile.buffer.toString('base64');
      } else if (pastedJobDescriptionText) {
        jobDescriptionText = pastedJobDescriptionText;
        jobDescriptionBase64 = Buffer.from(pastedJobDescriptionText).toString('base64');
        jobDescriptionUrl = ""; // No S3 URL for pasted text
      }

      const interviewData = {
        userId: demoUser.id,
        jobTitle,
        company: company || "",
        jobDescription: jobDescriptionBase64,
        resume: resumeBase64,
        resumeUrl,
        jobDescriptionUrl,
        resumeText,
        jobDescriptionText
      };

      const interview = await storage.createInterview(interviewData);
      
      // 3. Generate questions using AI (with Redis caching and smart fallbacks)
      try {
        const cacheKey = `questions:${crypto
          .createHash("sha256")
          .update(`${resumeText}|||${jobDescriptionText}`)
          .digest("hex")}`;

        let questions;
        const cachedQuestions = await getCache(cacheKey);

        if (cachedQuestions) {
          console.log("[Redis] Cache HIT! Retrieved questions from cache.");
          questions = JSON.parse(cachedQuestions);
        } else {
          console.log("[Redis] Cache MISS! Generating questions using Gemini...");
          questions = await generateInterviewQuestions(jobDescriptionText, resumeText);
          
          // Cache generated questions for 24 hours
          await setCache(cacheKey, JSON.stringify(questions), 3600 * 24);
        }

        await storage.updateInterview(interview.id, {
          questions: questions.map((q: any) => q.question)
        });
        console.log(`Generated ${questions.length} questions for interview ${interview.id}`);
      } catch (error) {
        console.error("Failed to generate questions with AI, using smart fallback:", error);
        
        // Create smarter fallback questions based on job title
        const normJobTitle = interview.jobTitle.toLowerCase();
        const fallbackQuestions = [
          "Hello! Please tell me your name and how many years of experience you have in your field?",
          `What interests you most about this ${normJobTitle} role and our company?`,
          "What are your main technical strengths and how have you applied them in previous roles?",
          "Can you describe a challenging project you've worked on recently that you're proud of?",
          "How do you approach problem-solving when facing technical challenges?",
          normJobTitle.includes('frontend') || normJobTitle.includes('front-end') ? 
            "What frontend technologies and frameworks are you most comfortable with?" :
            normJobTitle.includes('backend') || normJobTitle.includes('back-end') ?
            "What backend technologies and databases have you worked with?" :
            "What technologies are you most passionate about and why?",
          "Tell me about a time you had to learn something new quickly. How did you approach it?",
          "How do you handle working under pressure or tight deadlines?",
          `What would you like to achieve in this ${normJobTitle} role in the first 6 months?`,
          "Do you have any questions about the role or our team?"
        ];
        
        await storage.updateInterview(interview.id, {
          questions: fallbackQuestions
        });
        console.log(`Used ${fallbackQuestions.length} smart fallback questions for interview ${interview.id}`);
      }

      res.json(interview);
    } catch (error) {
      console.error("Error creating interview:", error);
      res.status(500).json({ message: "Failed to create interview" });
    }
  });

  // Start interview (update status to in_progress)
  app.post("/api/interviews/:id/start", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let interview = await storage.getInterview(id);
      
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      
      // If interview doesn't have questions, generate them now
      if (!interview.questions || interview.questions.length === 0) {
        console.log(`Interview ${id} has no questions, generating now...`);
        try {
          const questions = await generateInterviewQuestions(interview.jobDescription, interview.resume);
          interview = await storage.updateInterview(id, {
            questions: questions.map(q => q.question),
            status: "in_progress"
          });
          console.log(`Generated ${questions.length} questions for interview ${id}`);
        } catch (error) {
          console.error("Failed to generate questions, using smart fallback:", error);
          
          // Create smarter fallback questions based on job title
          const jobTitle = interview?.jobTitle ? interview.jobTitle.toLowerCase() : "unknown";
          const fallbackQuestions = [
            "Hello! Please tell me your name and how many years of experience you have in your field?",
            `What interests you most about this ${jobTitle} role and our company?`,
            "What are your main technical strengths and how have you applied them in previous roles?",
            "Can you describe a challenging project you've worked on recently that you're proud of?",
            "How do you approach problem-solving when facing technical challenges?",
            jobTitle.includes('frontend') || jobTitle.includes('front-end') ? 
              "What frontend technologies and frameworks are you most comfortable with?" :
              jobTitle.includes('backend') || jobTitle.includes('back-end') ?
              "What backend technologies and databases have you worked with?" :
              "What technologies are you most passionate about and why?",
            "Tell me about a time you had to learn something new quickly. How did you approach it?",
            "How do you handle working under pressure or tight deadlines?",
            `What would you like to achieve in this ${jobTitle} role in the first 6 months?`,
            "Do you have any questions about the role or our team?"
          ];
          
          interview = await storage.updateInterview(id, {
            questions: fallbackQuestions,
            status: "in_progress"
          });
          console.log(`Used ${fallbackQuestions.length} smart fallback questions for interview ${id}`);
        }
      } else {
        interview = await storage.updateInterview(id, {
          status: "in_progress"
        });
      }
      
      res.json(interview);
    } catch (error) {
      console.error("Error starting interview:", error);
      res.status(500).json({ message: "Failed to start interview" });
    }
  });

  // Submit interview response
  app.post("/api/interviews/:id/response", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { question, answer } = req.body;
      
      const interview = await storage.getInterview(id);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }

      const responses = interview.responses || [];
      responses.push({
        question,
        answer,
        timestamp: Date.now()
      });

      const updatedInterview = await storage.updateInterview(id, {
        responses
      });

      // Generate AI response
      try {
        const aiResponse = await generateInterviewResponse(question, responses);
        res.json({ interview: updatedInterview, aiResponse });
      } catch (error) {
        console.error("Failed to generate AI response:", error);
        res.json({ 
          interview: updatedInterview, 
          aiResponse: "Thank you for your response. Let's continue with the next question." 
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to submit response" });
    }
  });

  // Complete interview and generate feedback
  app.post("/api/interviews/:id/complete", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { duration } = req.body;
      
      const interview = await storage.getInterview(id);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }

      if (!interview.responses || interview.responses.length === 0) {
        return res.status(400).json({ message: "No responses found for interview" });
      }

      // Generate feedback using AI (with Redis caching and smart fallbacks)
      let feedback;
      const cacheKey = `feedback:${interview.id}`;

      try {
        const cachedFeedback = await getCache(cacheKey);
        if (cachedFeedback) {
          console.log(`[Redis] Cache HIT! Retrieved feedback for interview ${interview.id} from cache.`);
          feedback = JSON.parse(cachedFeedback);
        } else {
          console.log(`[Redis] Cache MISS! Generating feedback using Gemini for interview ${interview.id}...`);
          feedback = await analyzeFeedback(
            interview.questions || [],
            interview.responses,
            interview.jobDescriptionText || interview.jobDescription
          );
          
          // Cache generated feedback for 2 hours
          await setCache(cacheKey, JSON.stringify(feedback), 3600 * 2);
        }
      } catch (error) {
        console.error("Failed to generate feedback with AI, using smart fallback:", error);
        
        // Provide basic feedback structure if AI fails
        feedback = {
          overallScore: 75,
          technicalKnowledge: 80,
          communication: 70,
          problemSolving: 75,
          culturalFit: 75,
          strengths: ["Good technical knowledge", "Clear communication"],
          improvements: ["Practice more behavioral questions"],
          recommendations: ["Review common interview questions"],
          questionAnalysis: interview.responses.map(r => ({
            question: r.question,
            answer: r.answer,
            score: 75,
            feedback: "Good response with room for improvement"
          }))
        };
      }

      const updatedInterview = await storage.updateInterview(id, {
        status: "completed",
        feedback,
        duration,
        completedAt: new Date()
      });

      res.json(updatedInterview);
    } catch (error) {
      console.error("Error completing interview:", error);
      res.status(500).json({ message: "Failed to complete interview" });
    }
  });

  // Delete interview
  app.delete("/api/interviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInterview(id);
      
      if (!success) {
        return res.status(404).json({ message: "Interview not found" });
      }
      
      res.json({ message: "Interview deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete interview" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}