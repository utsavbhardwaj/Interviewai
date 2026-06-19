import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Serves the pre-built Vite client from dist/public in production.
 * This file has NO vite dependency so it is safe to import in production
 * without the vite package being installed.
 */
export function serveStatic(app: Express) {
  const distPath = path.resolve(
    import.meta.dirname || path.dirname(fileURLToPath(import.meta.url)),
    "public"
  );

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. ` +
      `Make sure to run \`npm run build\` before starting in production.`
    );
  }

  app.use(express.static(distPath));

  // SPA fallback — serve index.html for all non-API routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
