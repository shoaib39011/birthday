import { z } from "zod";

export type Stage = "welcome" | "balloons" | "message";

export const birthdayMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  recipientName: z.string().optional(),
});

export type BirthdayMessage = z.infer<typeof birthdayMessageSchema>;
