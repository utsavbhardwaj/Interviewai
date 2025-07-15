import { GoogleGenAI } from "@google/genai";
import { generateQuestionsWithDeepSeek } from "./deepseek";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
}

export interface FeedbackAnalysis {
  overallScore: number;
  technicalKnowledge: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  questionAnalysis: {
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
}

export async function generateInterviewQuestions(
  jobDescription: string,
  resume: string
): Promise<InterviewQuestion[]> {
  try {
    // Decode base64 data to text
    const decodedJobDescription = Buffer.from(jobDescription, 'base64').toString('utf-8');
    const decodedResume = Buffer.from(resume, 'base64').toString('utf-8');
    
    const prompt = `Based on the following job description and candidate resume, generate 10 interview questions with progressive difficulty that create a natural conversation flow.

Job Description:
${decodedJobDescription}

Resume:
${decodedResume}

Generate questions in this order:
1-3: Warm-up questions (basic experience, motivations, role understanding)
4-6: Core technical/role-specific questions (medium difficulty)
7-8: Deep technical scenarios with "why" and "how" follow-ups (challenging)
9-10: Advanced problem-solving and behavioral scenarios (most challenging)

Each question should:
- Build upon previous questions naturally
- Reference specific technologies/experience from the resume
- Align with job requirements
- Include follow-up "why" and "how" variations for deeper exploration

Return as JSON array with 'question', 'category' (warmup/technical/behavioral/advanced), and 'difficulty' (easy/medium/hard) fields.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              category: { type: "string" },
              difficulty: { type: "string" }
            },
            required: ["question", "category", "difficulty"]
          }
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Gemini API failed, trying DeepSeek as backup:", error);
    
    try {
      // Try DeepSeek as backup
      return await generateQuestionsWithDeepSeek(jobDescription, resume);
    } catch (deepseekError) {
      console.error("DeepSeek API also failed:", deepseekError);
      throw new Error(`Both AI services failed. Gemini: ${error}. DeepSeek: ${deepseekError}`);
    }
  }
}

export async function generateInterviewResponse(
  question: string,
  conversationHistory: { question: string; answer: string }[]
): Promise<string> {
  try {
    const historyContext = conversationHistory
      .map(item => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n\n');

    const prompt = `You are an AI interviewer conducting a professional job interview. Based on the conversation history and the current question, provide a natural follow-up response or ask the next question.

Conversation History:
${historyContext}

Current Question: ${question}

Provide a professional, encouraging response that:
1. Acknowledges the candidate's answer (if applicable)
2. Asks relevant follow-up questions
3. Maintains a conversational tone
4. Keeps the interview flowing naturally

Response:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Thank you for your response. Let's move on to the next question.";
  } catch (error) {
    console.error("Error generating interview response:", error);
    return "Thank you for your response. Let's continue with the interview.";
  }
}

export async function analyzeFeedback(
  questions: string[],
  responses: { question: string; answer: string }[],
  jobDescription: string
): Promise<FeedbackAnalysis> {
  try {
    // Decode base64 job description
    const decodedJobDescription = Buffer.from(jobDescription, 'base64').toString('utf-8');
    
    const qaHistory = responses
      .map(item => `Q: ${item.question}\nA: ${item.answer}`)
      .join('\n\n');

    const prompt = `Analyze this job interview performance and provide detailed feedback.

Job Description:
${decodedJobDescription}

Interview Q&A:
${qaHistory}

Provide a comprehensive analysis with:
1. Overall performance score (0-100)
2. Category scores for: technical knowledge, communication, problem solving, cultural fit (0-100 each)
3. Top 3 strengths demonstrated
4. Top 3 areas for improvement
5. Specific recommendations for future interviews
6. Question-by-question analysis with individual scores and feedback

Return as JSON with the specified structure.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            overallScore: { type: "number" },
            technicalKnowledge: { type: "number" },
            communication: { type: "number" },
            problemSolving: { type: "number" },
            culturalFit: { type: "number" },
            strengths: {
              type: "array",
              items: { type: "string" }
            },
            improvements: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            questionAnalysis: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                  score: { type: "number" },
                  feedback: { type: "string" }
                },
                required: ["question", "answer", "score", "feedback"]
              }
            }
          },
          required: ["overallScore", "technicalKnowledge", "communication", "problemSolving", "culturalFit", "strengths", "improvements", "recommendations", "questionAnalysis"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    throw new Error(`Failed to analyze feedback: ${error}`);
  }
}
