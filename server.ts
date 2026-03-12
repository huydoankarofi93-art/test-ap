import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  const db = new Database("readings.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS readings (
      id TEXT PRIMARY KEY,
      fullName TEXT,
      readingType TEXT,
      content TEXT,
      tuviChart TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/readings", (req, res) => {
    const { id, fullName, readingType, content, tuviChart } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO readings (id, fullName, readingType, content, tuviChart)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(id, fullName, readingType, content, JSON.stringify(tuviChart));
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save reading" });
    }
  });

  app.get("/api/readings", (req, res) => {
    try {
      const readings = db.prepare("SELECT * FROM readings ORDER BY createdAt DESC LIMIT 10").all();
      res.json(readings);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch readings" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
