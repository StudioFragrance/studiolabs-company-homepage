import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage-typeorm";
import { requireAuth, requireAdmin } from "./auth/naver-works";


export async function registerRoutes(app: Express): Promise<Server> {
  // 인증 라우트
  app.get('/auth/login', (req, res) => {
    res.redirect('/auth/naver-works');
  });

  // 네이버웍스 OAuth 시작
  app.get('/auth/naver-works', passport.authenticate('naver-works'));

  // 네이버웍스 OAuth 콜백
  app.get('/auth/naver-works/callback', 
    passport.authenticate('naver-works', { 
      failureRedirect: '/auth/login?error=1' 
    }),
    (req, res) => {
      // 인증 성공 시 관리자 페이지로 리다이렉트
      res.redirect('/admin');
    }
  );

  // 로그아웃
  app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('로그아웃 오류:', err);
      }
      res.redirect('/');
    });
  });

  // 현재 사용자 정보 가져오기
  app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: '인증되지 않음' });
    }
  });

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

  // Update site content (관리자 권한 필요)
  app.put("/api/site-content/:key", requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const data = req.body.data || req.body;
      
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
