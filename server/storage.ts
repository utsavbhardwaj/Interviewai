import { users, interviews, type User, type InsertUser, type Interview, type InsertInterview, type UpdateInterview } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Interview methods
  getInterview(id: number): Promise<Interview | undefined>;
  getInterviewsByUserId(userId: number): Promise<Interview[]>;
  createInterview(interview: InsertInterview & { userId: number }): Promise<Interview>;
  updateInterview(id: number, updates: UpdateInterview): Promise<Interview | undefined>;
  deleteInterview(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private interviews: Map<number, Interview>;
  private currentUserId: number;
  private currentInterviewId: number;

  constructor() {
    this.users = new Map();
    this.interviews = new Map();
    this.currentUserId = 1;
    this.currentInterviewId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getInterview(id: number): Promise<Interview | undefined> {
    return this.interviews.get(id);
  }

  async getInterviewsByUserId(userId: number): Promise<Interview[]> {
    return Array.from(this.interviews.values()).filter(
      (interview) => interview.userId === userId,
    );
  }

  async createInterview(interview: InsertInterview & { userId: number }): Promise<Interview> {
    const id = this.currentInterviewId++;
    const newInterview: Interview = {
      ...interview,
      id,
      company: interview.company || null,
      status: "pending",
      questions: null,
      responses: null,
      feedback: null,
      duration: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.interviews.set(id, newInterview);
    return newInterview;
  }

  async updateInterview(id: number, updates: UpdateInterview): Promise<Interview | undefined> {
    const interview = this.interviews.get(id);
    if (!interview) return undefined;

    const updatedInterview: Interview = {
      ...interview,
      ...updates,
      questions: updates.questions ? [...updates.questions] : interview.questions,
      responses: updates.responses ? [...updates.responses] : interview.responses,
      feedback: updates.feedback ? {
        ...updates.feedback,
        strengths: Array.isArray(updates.feedback.strengths) ? [...updates.feedback.strengths] : updates.feedback.strengths,
        improvements: Array.isArray(updates.feedback.improvements) ? [...updates.feedback.improvements] : updates.feedback.improvements,
        recommendations: Array.isArray(updates.feedback.recommendations) ? [...updates.feedback.recommendations] : updates.feedback.recommendations,
        questionAnalysis: Array.isArray(updates.feedback.questionAnalysis) ? [...updates.feedback.questionAnalysis] : updates.feedback.questionAnalysis
      } : interview.feedback,
    };
    this.interviews.set(id, updatedInterview);
    return updatedInterview;
  }

  async deleteInterview(id: number): Promise<boolean> {
    return this.interviews.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getInterview(id: number): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview || undefined;
  }

  async getInterviewsByUserId(userId: number): Promise<Interview[]> {
    return await db.select().from(interviews).where(eq(interviews.userId, userId));
  }

  async createInterview(interview: InsertInterview & { userId: number }): Promise<Interview> {
    const [newInterview] = await db
      .insert(interviews)
      .values({
        ...interview,
        status: "pending",
        questions: null,
        responses: null,
        feedback: null,
        duration: null,
        completedAt: null,
      })
      .returning();
    return newInterview;
  }

  async updateInterview(id: number, updates: UpdateInterview): Promise<Interview | undefined> {
    const updateData: any = { ...updates };
    
    // Ensure array fields are properly handled
    if (updateData.questions && Array.isArray(updateData.questions)) {
      updateData.questions = [...updateData.questions];
    }
    if (updateData.responses && Array.isArray(updateData.responses)) {
      updateData.responses = [...updateData.responses];
    }
    
    const [updatedInterview] = await db
      .update(interviews)
      .set(updateData)
      .where(eq(interviews.id, id))
      .returning();
    return updatedInterview || undefined;
  }

  async deleteInterview(id: number): Promise<boolean> {
    const result = await db.delete(interviews).where(eq(interviews.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
