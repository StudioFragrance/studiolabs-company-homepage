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
  app.get('/auth/naver-works', (req, res, next) => {
    console.log('네이버웍스 OAuth 로그인 요청 시작');
    passport.authenticate('naver-works', (err: any, user: any, info: any) => {
      if (err) {
        console.error('OAuth 인증 오류:', err);
        return res.redirect('/login?error=oauth_error');
      }
      if (!user) {
        console.error('OAuth 사용자 정보 없음:', info);
        return res.redirect('/login?error=no_user');
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('로그인 세션 오류:', err);
          return res.redirect('/login?error=session_error');
        }
        return res.redirect('/admin');
      });
    })(req, res, next);
  });

  // 네이버웍스 OAuth 콜백
  app.get('/auth/naver-works/callback', (req, res, next) => {
    console.log('네이버웍스 OAuth 콜백 수신:', req.query);
    
    passport.authenticate('naver-works', async (err: any, user: any, info: any) => {
      if (err) {
        console.error('OAuth 콜백 오류:', err);
        return res.redirect('/login?error=callback_error');
      }
      if (!user) {
        console.error('OAuth 콜백 사용자 정보 없음:', info);
        return res.redirect('/login?error=no_user_callback');
      }
      
      try {
        // 관리자 권한 확인 (데이터베이스 기반)
        const permissionsModule = await import('./auth/permissions');
        const hasAdminRights = await permissionsModule.hasAdminPermission(user);
        
        if (!hasAdminRights) {
          console.log('관리자 권한 없음:', user.email);
          return res.redirect('/login?error=no_permission&email=' + encodeURIComponent(user.email));
        }
        
        req.logIn(user, (err) => {
          if (err) {
            console.error('콜백 로그인 세션 오류:', err);
            return res.redirect('/login?error=session_error');
          }
          console.log('OAuth 로그인 성공:', user.email);
          return res.redirect('/admin');
        });
      } catch (error) {
        console.error('권한 확인 중 오류:', error);
        return res.redirect('/login?error=permission_check_error');
      }
    })(req, res, next);
  });

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
  
  // Get all site content (공개 API - 프론트엔드에서 사용)
  app.get("/api/site-content", async (req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      // 민감한 정보 제거 (createdAt, updatedAt는 공개해도 됨)
      const publicContent = content.map(item => ({
        id: item.id,
        key: item.key,
        data: item.data,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      res.json(publicContent);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  // Get specific site content by key (공개 API - 프론트엔드에서 사용)
  app.get("/api/site-content/:key", async (req, res) => {
    try {
      const { key } = req.params;
      
      // 파라미터 검증
      if (!key || typeof key !== 'string' || key.length > 50) {
        return res.status(400).json({ error: "Invalid content key" });
      }
      
      // 허용된 키만 조회 가능
      const allowedKeys = ['hero', 'brandStory', 'companyHistory', 'mvc', 'contact'];
      if (!allowedKeys.includes(key)) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      const content = await storage.getSiteContent(key);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // 공개 정보만 반환
      const publicContent = {
        id: content.id,
        key: content.key,
        data: content.data,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt
      };
      
      res.json(publicContent);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  // Update site content (관리자 권한 필요)
  app.put("/api/site-content/:key", requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      
      // 파라미터 검증
      if (!key || typeof key !== 'string' || key.length > 50) {
        return res.status(400).json({ error: "Invalid content key" });
      }
      
      // 허용된 키만 수정 가능
      const allowedKeys = ['hero', 'brandStory', 'companyHistory', 'mvc', 'contact'];
      if (!allowedKeys.includes(key)) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // 요청 본문 검증
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: "Invalid request body" });
      }
      
      // data 필드가 있으면 사용, 없으면 전체 body 사용 (하지만 안전하게)
      const data = req.body.data !== undefined ? req.body.data : req.body;
      
      // 데이터 크기 제한 (1MB)
      const dataString = JSON.stringify(data);
      if (dataString.length > 1024 * 1024) {
        return res.status(413).json({ error: "Data too large" });
      }
      
      const content = await storage.updateSiteContent(key, data);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // 업데이트 로그
      console.log(`Content updated by admin: ${key}, user: ${(req.user as any)?.email}`);
      
      res.json(content);
    } catch (error) {
      console.error("Error updating site content:", error);
      // 상세한 에러 정보는 로그에만 기록하고, 클라이언트에는 일반적인 메시지만 전송
      res.status(500).json({ error: "Failed to update site content" });
    }
  });

  // Health check for site content (관리자 전용)
  app.get("/api/admin/site-content/status", requireAdmin, async (req, res) => {
    try {
      const allContent = await storage.getAllSiteContent();
      res.json({ 
        message: "Site content status",
        contentCount: allContent.length,
        sections: allContent.map(c => c.key),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error checking site content status:", error);
      res.status(500).json({ error: "Failed to check site content status" });
    }
  });

  // Admin User Management API routes

  // Get all admin users (관리자 전용)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const adminUsers = await storage.getAllAdminUsers();
      res.json(adminUsers);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ error: "Failed to fetch admin users" });
    }
  });

  // Add new admin user (관리자 전용)
  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const { email, name, note } = req.body;
      
      // 입력 검증
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: "Valid email is required" });
      }
      
      // 중복 확인
      const existingUser = await storage.getAdminUser(email);
      if (existingUser) {
        return res.status(409).json({ error: "Admin user already exists" });
      }
      
      const adminUser = await storage.createAdminUser({
        email: email.trim().toLowerCase(),
        name: name?.trim() || undefined,
        note: note?.trim() || undefined,
        isActive: true
      });
      
      console.log(`New admin user created: ${email} by ${(req.user as any)?.email}`);
      res.status(201).json(adminUser);
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  // Update admin user (관리자 전용)
  app.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, note, isActive } = req.body;
      
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Valid user ID is required" });
      }
      
      const adminUser = await storage.updateAdminUser(Number(id), {
        name: name?.trim() || undefined,
        note: note?.trim() || undefined,
        isActive: Boolean(isActive)
      });
      
      if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      console.log(`Admin user updated: ${adminUser.email} by ${(req.user as any)?.email}`);
      res.json(adminUser);
    } catch (error) {
      console.error("Error updating admin user:", error);
      res.status(500).json({ error: "Failed to update admin user" });
    }
  });

  // Delete admin user (관리자 전용)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Valid user ID is required" });
      }
      
      // 삭제하려는 사용자 정보 확인
      const userToDelete = await storage.getAdminUserById(Number(id));
      
      if (!userToDelete) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      // 대표자 계정 삭제 방지
      if (userToDelete.email === 'partis98@studiolabs.co.kr') {
        return res.status(403).json({ 
          error: "대표자 계정은 삭제할 수 없습니다.",
          message: "The founder account cannot be deleted for security reasons."
        });
      }
      
      const success = await storage.deleteAdminUser(Number(id));
      
      if (!success) {
        return res.status(404).json({ error: "Admin user not found" });
      }
      
      console.log(`Admin user deleted: ${userToDelete.email} (ID: ${id}) by ${(req.user as any)?.email}`);
      res.json({ message: "Admin user deleted successfully" });
    } catch (error) {
      console.error("Error deleting admin user:", error);
      res.status(500).json({ error: "Failed to delete admin user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
