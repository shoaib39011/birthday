import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { birthdayMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/message", async (_req, res) => {
    try {
      const message = await storage.getMessage();
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to get message" });
    }
  });

  app.post("/api/message", async (req, res) => {
    try {
      const validated = birthdayMessageSchema.parse(req.body);
      const message = await storage.updateMessage(validated);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
