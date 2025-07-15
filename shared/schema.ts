import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  jobTitle: text("job_title").notNull(),
  company: text("company"),
  jobDescription: text("job_description").notNull(),
  resume: text("resume").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  questions: jsonb("questions").$type<string[]>(),
  responses: jsonb("responses").$type<{ question: string; answer: string; timestamp: number }[]>(),
  feedback: jsonb("feedback").$type<{
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
  }>(),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).pick({
  jobTitle: true,
  company: true,
  jobDescription: true,
  resume: true,
});

export const updateInterviewSchema = createInsertSchema(interviews).pick({
  status: true,
  questions: true,
  responses: true,
  feedback: true,
  duration: true,
  completedAt: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type UpdateInterview = z.infer<typeof updateInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;
