import {
  paintings,
  contactMessages,
  users,
  type Painting,
  type InsertPainting,
  type ContactMessage,
  type InsertContactMessage,
  type User,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Painting operations
  getPaintings(): Promise<Painting[]>;
  getPainting(id: number): Promise<Painting | undefined>;
  createPainting(painting: InsertPainting): Promise<Painting>;
  updatePainting(id: number, painting: Partial<InsertPainting>): Promise<Painting>;
  deletePainting(id: number): Promise<void>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Painting operations
  async getPaintings(): Promise<Painting[]> {
    return await db.select().from(paintings).orderBy(desc(paintings.createdAt));
  }

  async getPainting(id: number): Promise<Painting | undefined> {
    const [painting] = await db.select().from(paintings).where(eq(paintings.id, id));
    return painting;
  }

  async createPainting(painting: InsertPainting): Promise<Painting> {
    const [newPainting] = await db
      .insert(paintings)
      .values(painting)
      .returning();
    return newPainting;
  }

  async updatePainting(id: number, painting: Partial<InsertPainting>): Promise<Painting> {
    const [updatedPainting] = await db
      .update(paintings)
      .set({ ...painting, updatedAt: new Date() })
      .where(eq(paintings.id, id))
      .returning();
    return updatedPainting;
  }

  async deletePainting(id: number): Promise<void> {
    await db.delete(paintings).where(eq(paintings.id, id));
  }

  // Contact message operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
}

export const storage = new DatabaseStorage();
