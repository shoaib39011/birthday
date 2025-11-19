import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { customMessages, photos, type CustomMessage, type InsertMessage, type InsertPhoto, type Photo } from "@shared/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface IStorage {
  getDefaultMessage(): Promise<{ message: string; recipientName?: string }>;
  createCustomMessage(data: InsertMessage): Promise<CustomMessage>;
  getCustomMessage(id: string): Promise<CustomMessage | undefined>;
  updateCustomMessage(id: string, data: InsertMessage): Promise<CustomMessage | undefined>;
  addPhoto(data: InsertPhoto): Promise<Photo>;
  getPhotos(messageId?: string): Promise<Photo[]>;
  deletePhoto(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async getDefaultMessage(): Promise<{ message: string; recipientName?: string }> {
    return {
      message: `You bring so much joy and happiness into this world. On your special day, I want you to know how incredibly amazing you are. May this year bring you endless smiles, unforgettable moments, and all the love your heart can hold. You deserve every wonderful thing that comes your way. Here's to celebrating YOU today and always!`,
      recipientName: undefined,
    };
  }

  async createCustomMessage(data: InsertMessage): Promise<CustomMessage> {
    const id = generateShortId();
    const [message] = await db
      .insert(customMessages)
      .values({ ...data, id })
      .returning();
    return message;
  }

  async getCustomMessage(id: string): Promise<CustomMessage | undefined> {
    const [message] = await db
      .select()
      .from(customMessages)
      .where(eq(customMessages.id, id))
      .limit(1);
    return message;
  }

  async updateCustomMessage(id: string, data: InsertMessage): Promise<CustomMessage | undefined> {
    const [message] = await db
      .update(customMessages)
      .set(data)
      .where(eq(customMessages.id, id))
      .returning();
    return message;
  }

  async addPhoto(data: InsertPhoto): Promise<Photo> {
    const [photo] = await db
      .insert(photos)
      .values(data)
      .returning();
    return photo;
  }

  async getPhotos(messageId?: string): Promise<Photo[]> {
    if (messageId) {
      return await db
        .select()
        .from(photos)
        .where(eq(photos.messageId, messageId));
    }
    return await db.select().from(photos);
  }

  async deletePhoto(id: string): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }
}

export const storage = new DbStorage();
