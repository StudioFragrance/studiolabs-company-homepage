import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import {createServer as createViteServer, createLogger, ViteDevServer} from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}


async function setupVite(app: Express, server: Server) {
  const vite: ViteDevServer = await createViteServer({
    ...viteConfig,
    server: { middlewareMode: true, hmr: { server } },
    appType: "custom",
    customLogger: viteLogger,
    configFile: false,
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(import.meta.dirname, "..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}`);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
  log("Vite development server is running.", "vite");
}

// 프로덕션 환경용 설정 함수
function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
  log("Serving static files from dist/. a", "express");
}

//--- 메인 설정 함수 (이 함수를 외부에서 사용) ---

/**
 * NODE_ENV에 따라 개발 서버 또는 정적 파일 서빙을 설정합니다.
 */
export async function setupServer(app: Express, server: Server) {
  if (process.env.NODE_ENV === 'development') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
}