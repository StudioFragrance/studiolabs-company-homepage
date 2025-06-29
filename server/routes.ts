import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-typeorm";


export async function registerRoutes(app: Express): Promise<Server> {
  // Site Content API routes
  
  // Get all site content
  app.get("/api/site-content", async (req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  // Get specific site content by key
  app.get("/api/site-content/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const content = await storage.getSiteContent(key);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  // Update site content
  app.put("/api/site-content/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const { data } = req.body;
      
      const content = await storage.updateSiteContent(key, data);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error updating site content:", error);
      res.status(500).json({ error: "Failed to update site content" });
    }
  });

  // Health check for site content
  app.get("/api/site-content/status", async (req, res) => {
    try {
      const allContent = await storage.getAllSiteContent();
      res.json({ 
        message: "Site content status",
        contentCount: allContent.length,
        sections: allContent.map(c => c.key)
      });
    } catch (error) {
      console.error("Error checking site content status:", error);
      res.status(500).json({ error: "Failed to check site content status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
