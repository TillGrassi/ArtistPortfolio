import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPaintingSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public painting routes
  app.get('/api/paintings', async (req, res) => {
    try {
      const paintings = await storage.getPaintings();
      res.json(paintings);
    } catch (error) {
      console.error("Error fetching paintings:", error);
      res.status(500).json({ message: "Failed to fetch paintings" });
    }
  });

  app.get('/api/paintings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid painting ID" });
      }
      
      const painting = await storage.getPainting(id);
      if (!painting) {
        return res.status(404).json({ message: "Painting not found" });
      }
      
      res.json(painting);
    } catch (error) {
      console.error("Error fetching painting:", error);
      res.status(500).json({ message: "Failed to fetch painting" });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Protected admin routes
  app.post('/api/admin/paintings', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      // Process the uploaded file
      const originalName = req.file.originalname;
      const extension = path.extname(originalName);
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
      const filepath = path.join('uploads', filename);
      
      // Move file to permanent location
      fs.renameSync(req.file.path, filepath);
      
      // Parse form data
      const paintingData = {
        title: req.body.title,
        year: parseInt(req.body.year),
        medium: req.body.medium,
        size: req.body.size,
        description: req.body.description || null,
        imageUrl: `/uploads/${filename}`,
        availability: req.body.availability || "available",
        tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : [],
        featured: req.body.featured === 'true',
      };

      const validatedData = insertPaintingSchema.parse(paintingData);
      const painting = await storage.createPainting(validatedData);
      
      res.status(201).json(painting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating painting:", error);
      res.status(500).json({ message: "Failed to create painting" });
    }
  });

  app.put('/api/admin/paintings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid painting ID" });
      }

      const validatedData = insertPaintingSchema.partial().parse(req.body);
      const painting = await storage.updatePainting(id, validatedData);
      
      res.json(painting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error updating painting:", error);
      res.status(500).json({ message: "Failed to update painting" });
    }
  });

  app.delete('/api/admin/paintings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid painting ID" });
      }

      await storage.deletePainting(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting painting:", error);
      res.status(500).json({ message: "Failed to delete painting" });
    }
  });

  app.get('/api/admin/messages', isAuthenticated, async (req: any, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}
