import "dotenv/config";
import "reflect-metadata";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./db";
import { setupNaverWorksAuth } from "./auth/naver-works";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24시간
  },
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database connection
  await initializeDatabase();

  // 네이버웍스 인증 설정
  const isAuthEnabled = setupNaverWorksAuth();
  if (isAuthEnabled) {
    log("네이버웍스 OAuth 인증이 활성화되었습니다.");
  } else {
    log("네이버웍스 OAuth 환경변수가 없어 인증이 비활성화되었습니다.");
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // serve the app on port 5000
  // this serves both the API and the client.
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  // Use appropriate host based on environment
  // 0.0.0.0 for Replit/cloud/Docker environments, localhost for local development
  const isCloudEnvironment = process.env.REPL_ID || process.env.RAILWAY_ENVIRONMENT || process.env.RENDER || process.env.VERCEL || process.env.NODE_ENV === 'production';
  const host = isCloudEnvironment ? "0.0.0.0" : "localhost";
  
  server.listen({
    port,
    host,
    reusePort: isCloudEnvironment ? true : false,
  }, () => {
    log(`serving on ${host}:${port}`);
  });
})();
