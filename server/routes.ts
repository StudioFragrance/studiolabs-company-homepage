import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-typeorm";
import { siteConfig } from "@shared/siteConfig";

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

  // Initialize site content with default data from siteConfig
  app.post("/api/site-content/initialize", async (req, res) => {
    try {
      const sections = [
        { key: 'hero', data: siteConfig.hero },
        { key: 'brandStory', data: siteConfig.brandStory },
        { key: 'companyHistory', data: siteConfig.companyHistory },
        { key: 'mvc', data: siteConfig.mvc },
        { key: 'contact', data: siteConfig.contact },
        { key: 'company', data: siteConfig.company }
      ];

      const results = [];
      
      for (const section of sections) {
        // Check if content already exists
        const existing = await storage.getSiteContent(section.key);
        if (!existing) {
          const created = await storage.createSiteContent(section);
          results.push(created);
        }
      }

      res.json({ 
        message: "Site content initialized", 
        created: results.length,
        sections: results 
      });
    } catch (error) {
      console.error("Error initializing site content:", error);
      res.status(500).json({ error: "Failed to initialize site content" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
