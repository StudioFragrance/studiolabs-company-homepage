import "dotenv/config";
import "reflect-metadata";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { initializeDatabase } from "./db";
import { setupNaverWorksAuth } from "./auth/naver-works";
import {log, setupServer} from "./vite.ts";

const app = express();

// 프록시 신뢰 설정 (Replit 환경)
app.set('trust proxy', 1);

// 보안 미들웨어
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Vite 개발 모드에서 필요
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"], // WebSocket 연결 허용
      fontSrc: ["'self'", "https:", "data:"],
    },
  },
}));

// API 요청 제한
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 15분당 최대 100회 요청
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 관리자 API 요청 제한 (더 엄격)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 30, // 15분당 최대 30회 요청
  message: {
    error: "Too many admin requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API 엔드포인트에 레이트 리미팅 적용
app.use('/api/', apiLimiter);
app.use('/api/site-content', (req, res, next) => {
  if (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') {
    return adminLimiter(req, res, next);
  }
  next();
});

app.use(express.json({ limit: '1mb' })); // JSON 크기 제한
app.use(express.urlencoded({ extended: false, limit: '1mb' })); // URL-encoded 크기 제한

// 세션 설정 (환경별 최적화)
const isProduction = process.env.NODE_ENV === 'production';
console.log('세션 설정:', { isProduction, NODE_ENV: process.env.NODE_ENV });

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true, // Docker HTTP 환경에서 true로 변경
  saveUninitialized: true, // 초기화되지 않은 세션도 저장
  cookie: {
    secure: isProduction, // Production에서는 HTTPS만 허용
    httpOnly: false, // 클라이언트 접근 허용 (디버깅용)
    maxAge: 24 * 60 * 60 * 1000, // 24시간
    sameSite: isProduction ? 'strict' : false, // Production에서는 strict, 개발환경에서는 비활성화
  },
  name: 'connect.sid', // 기본 세션 쿠키 이름 사용
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
  await setupServer(app, server);

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
