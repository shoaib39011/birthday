import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type Stage = "welcome" | "balloons" | "message";

export const customMessages = pgTable("custom_messages", {
  id: varchar("id", { length: 12 }).primaryKey(),
  message: text("message").notNull(),
  recipientName: text("recipient_name"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id", { length: 12 }).references(() => customMessages.id),
  url: text("url").notNull(),
  caption: text("caption"),
  uploadedAt: timestamp("uploaded_at").notNull().default(sql`now()`),
});

export const insertMessageSchema = createInsertSchema(customMessages).omit({
  id: true,
  createdAt: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  uploadedAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type CustomMessage = typeof customMessages.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

export const birthdayMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  recipientName: z.string().optional(),
});

export type BirthdayMessage = z.infer<typeof birthdayMessageSchema>;
