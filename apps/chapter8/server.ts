import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";

const PORT = 3008;
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");

// --- In-memory data ---

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

interface Session {
  userId: string;
  expires: Date;
}

interface SavedSearch {
  id: string;
  userId: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  createdAt: string;
}

let demoUser: User;
const sessions = new Map<string, Session>();
const savedSearches = new Map<string, SavedSearch>();

async function init() {
  const hash = await bcrypt.hash("password123", 10);
  demoUser = {
    id: "user-1",
    name: "Demo User",
    email: "demo@example.com",
    passwordHash: hash,
  };
}

// --- Helpers ---

function getSessionFromCookie(req: http.IncomingMessage): Session | null {
  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.match(/session_token=([^;]+)/);
  if (!match) return null;
  const session = sessions.get(match[1]);
  if (!session) return null;
  if (session.expires < new Date()) {
    sessions.delete(match[1]);
    return null;
  }
  return session;
}

function getUserFromRequest(req: http.IncomingMessage): User | null {
  const session = getSessionFromCookie(req);
  if (!session) return null;
  if (session.userId === demoUser.id) return demoUser;
  return null;
}

function parseBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJSON(res: http.ServerResponse, status: number, data: unknown) {
  const json = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
  });
  res.end(json);
}

function redirect(res: http.ServerResponse, location: string, cookie?: string) {
  const headers: Record<string, string | string[]> = { Location: location };
  if (cookie) headers["Set-Cookie"] = cookie;
  res.writeHead(302, headers);
  res.end();
}

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function serveStatic(res: http.ServerResponse, filePath: string) {
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!fs.existsSync(resolved)) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }
  const ext = path.extname(resolved);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const content = fs.readFileSync(resolved);
  res.writeHead(200, { "Content-Type": contentType });
  res.end(content);
}

// --- Server ---

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method || "GET";

  try {
    // --- API Routes ---

    if (pathname === "/api/auth/login" && method === "POST") {
      const raw = await parseBody(req);
      let email: string;
      let password: string;

      const ct = req.headers["content-type"] || "";
      if (ct.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(raw);
        email = params.get("email") || "";
        password = params.get("password") || "";
      } else {
        const json = JSON.parse(raw);
        email = json.email || "";
        password = json.password || "";
      }

      if (
        email === demoUser.email &&
        (await bcrypt.compare(password, demoUser.passwordHash))
      ) {
        const token = crypto.randomUUID();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        sessions.set(token, { userId: demoUser.id, expires });
        redirect(
          res,
          "/dashboard",
          `session_token=${token}; Path=/; HttpOnly; Expires=${expires.toUTCString()}`,
        );
      } else {
        redirect(res, "/login?error=invalid");
      }
      return;
    }

    if (pathname === "/api/auth/logout" && method === "POST") {
      const cookieHeader = req.headers.cookie || "";
      const match = cookieHeader.match(/session_token=([^;]+)/);
      if (match) sessions.delete(match[1]);
      redirect(res, "/", "session_token=; Path=/; HttpOnly; Max-Age=0");
      return;
    }

    if (pathname === "/api/auth/status" && method === "GET") {
      const user = getUserFromRequest(req);
      if (user) {
        sendJSON(res, 200, { authenticated: true, user: { name: user.name } });
      } else {
        sendJSON(res, 200, { authenticated: false });
      }
      return;
    }

    if (pathname === "/api/csrf" && method === "GET") {
      sendJSON(res, 200, { csrfToken: crypto.randomBytes(16).toString("hex") });
      return;
    }

    if (pathname === "/api/user/searches" && method === "POST") {
      const user = getUserFromRequest(req);
      if (!user) {
        sendJSON(res, 401, { error: "Unauthorized" });
        return;
      }
      const raw = await parseBody(req);
      const data = JSON.parse(raw);
      const id = crypto.randomUUID();
      const search: SavedSearch = {
        id,
        userId: user.id,
        destination: data.destination || "",
        checkIn: data.checkIn || "",
        checkOut: data.checkOut || "",
        minPrice: data.minPrice ?? 0,
        maxPrice: data.maxPrice ?? 1000,
        amenities: data.amenities || [],
        createdAt: new Date().toISOString(),
      };
      savedSearches.set(id, search);
      sendJSON(res, 201, { message: "Search saved successfully", id });
      return;
    }

    if (pathname === "/api/user/searches" && method === "GET") {
      const user = getUserFromRequest(req);
      if (!user) {
        sendJSON(res, 401, { error: "Unauthorized" });
        return;
      }
      const searches = Array.from(savedSearches.values()).filter(
        (s) => s.userId === user.id,
      );
      sendJSON(res, 200, { searches });
      return;
    }

    const searchMatch = pathname.match(/^\/api\/user\/searches\/(.+)$/);
    if (searchMatch) {
      const user = getUserFromRequest(req);
      if (!user) {
        sendJSON(res, 401, { error: "Unauthorized" });
        return;
      }
      const id = searchMatch[1];
      const search = savedSearches.get(id);
      if (!search || search.userId !== user.id) {
        sendJSON(res, 404, { error: "Not found" });
        return;
      }
      if (method === "GET") {
        sendJSON(res, 200, search);
        return;
      }
      if (method === "DELETE") {
        savedSearches.delete(id);
        sendJSON(res, 200, { message: "Deleted" });
        return;
      }
    }

    // --- Page Routes ---

    if (pathname === "/" && method === "GET") {
      serveStatic(res, path.join(PUBLIC_DIR, "index.html"));
      return;
    }

    if (pathname === "/login" && method === "GET") {
      serveStatic(res, path.join(PUBLIC_DIR, "login.html"));
      return;
    }

    if (pathname === "/search" && method === "GET") {
      serveStatic(res, path.join(PUBLIC_DIR, "search.html"));
      return;
    }

    if (pathname === "/dashboard" && method === "GET") {
      const user = getUserFromRequest(req);
      if (!user) {
        redirect(res, "/login");
        return;
      }
      serveStatic(res, path.join(PUBLIC_DIR, "dashboard.html"));
      return;
    }

    // --- Static Files ---
    const staticPath = path.join(PUBLIC_DIR, pathname);
    if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
      serveStatic(res, staticPath);
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  } catch (err) {
    console.error("Server error:", err);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

init().then(() => {
  server.listen(PORT, () => {
    console.log(`Chapter 8 server running on http://localhost:${PORT}`);
  });
});
