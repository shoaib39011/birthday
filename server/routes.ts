import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertPhotoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/message", async (req, res) => {
    try {
      const messageId = req.query.id as string | undefined;
      
      if (messageId) {
        const customMessage = await storage.getCustomMessage(messageId);
        if (!customMessage) {
          return res.status(404).json({ error: "Message not found" });
        }
        res.json({
          message: customMessage.message,
          recipientName: customMessage.recipientName,
        });
      } else {
        const defaultMessage = await storage.getDefaultMessage();
        res.json(defaultMessage);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get message" });
    }
  });

  app.post("/api/message", async (req, res) => {
    try {
      const validated = insertMessageSchema.parse(req.body);
      const message = await storage.createCustomMessage(validated);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.put("/api/message/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertMessageSchema.parse(req.body);
      const message = await storage.updateCustomMessage(id, validated);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.post("/api/photos", async (req, res) => {
    try {
      const validated = insertPhotoSchema.parse(req.body);
      const photo = await storage.addPhoto(validated);
      res.json(photo);
    } catch (error) {
      res.status(400).json({ error: "Invalid photo data" });
    }
  });

  app.get("/api/photos", async (req, res) => {
    try {
      const messageId = req.query.messageId as string | undefined;
      const photos = await storage.getPhotos(messageId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to get photos" });
    }
  });

  app.delete("/api/photos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePhoto(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
