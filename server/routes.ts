import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertInterviewSchema, updateInterviewSchema } from "@shared/schema";
import { generateInterviewQuestions, generateInterviewResponse, analyzeFeedback } from "./services/gemini";
import multer from "multer";
import cors from "cors";

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
      const { jobTitle, company } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.resume || !files.jobDescription) {
        return res.status(400).json({ message: "Resume and job description are required" });
      }

      const resume = files.resume[0].buffer.toString('base64');
      const jobDescription = files.jobDescription[0].buffer.toString('base64');

      const interviewData = {
        userId: demoUser.id,
        jobTitle,
        company: company || "",
        jobDescription,
        resume
      };

      const interview = await storage.createInterview(interviewData);
      
      // Generate questions using AI with fallback
      try {
        const questions = await generateInterviewQuestions(jobDescription, resume);
        await storage.updateInterview(interview.id, {
          questions: questions.map(q => q.question)
        });
        console.log(`Generated ${questions.length} questions for interview ${interview.id}`);
      } catch (error) {
        console.error("Failed to generate questions with AI, using smart fallback:", error);
        
        // Create smarter fallback questions based on job title and available content
        const jobTitle = interview.jobTitle.toLowerCase();
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

      // Generate feedback using AI
      let feedback;
      try {
        feedback = await analyzeFeedback(
          interview.questions || [],
          interview.responses,
          interview.jobDescription
        );
      } catch (error) {
        console.error("Failed to generate feedback:", error);
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