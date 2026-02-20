import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SignJWT, jwtVerify } from "jose";
import {
  generateMathProblem,
  encryptCaptchaSolution,
  verifyCaptchaSolution,
} from "./src/lib/captcha";
import { generateMarketData, generateOrderBook } from "./src/lib/data-generator";

// ─── Constants ───────────────────────────────────────────────────────────────

const PORT = 3011;
const JWT_SECRET = new TextEncoder().encode("crypto-defend-jwt-secret-key");
const SESSION_COOKIE_NAME = "crypto_defend_session";

const HONEYPOT_PATHS = [
  "/admin-login",
  "/internal-api",
  "/scraper-trap",
  "/.env",
  "/admin",
  "/wp-login.php",
  "/wp-admin",
  "/config",
];

const HONEYPOT_PARAMS = ["debug", "access_token", "admin", "robot", "spider"];

const USERS: Record<string, { password: string; name: string; accessLevel: "basic" | "premium" }> = {
  demo: { password: "password123", name: "Demo User", accessLevel: "basic" },
  premium: { password: "premium123", name: "Premium User", accessLevel: "premium" },
};

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".txt": "text/plain",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

// ─── Session Types ───────────────────────────────────────────────────────────

interface SessionData {
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
  accessLevel: "public" | "basic" | "premium";
  captchaPassed?: boolean;
  exp?: number;
}

// ─── Rate Limiter ────────────────────────────────────────────────────────────

interface RateLimitResult {
  limited: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
}

const rateLimitConfigs: Record<string, { limit: number; windowSizeInSeconds: number }> = {
  market: { limit: 20, windowSizeInSeconds: 60 },
  orderbook: { limit: 10, windowSizeInSeconds: 60 },
  premium: { limit: 5, windowSizeInSeconds: 60 },
  auth: { limit: 5, windowSizeInSeconds: 60 },
  captcha: { limit: 10, windowSizeInSeconds: 60 },
  global: { limit: 60, windowSizeInSeconds: 60 },
  default: { limit: 60, windowSizeInSeconds: 60 },
};

const ipRequestStore: Record<string, { count: number; resetAt: number }> = {};

setInterval(() => {
  const now = Date.now();
  for (const key in ipRequestStore) {
    if (ipRequestStore[key].resetAt < now) {
      delete ipRequestStore[key];
    }
  }
}, 60000);

function checkRateLimit(req: IncomingMessage, type: string = "default", customLimit?: number): RateLimitResult {
  const ip = req.socket.remoteAddress ?? "127.0.0.1";
  const userAgent = req.headers["user-agent"] ?? "";
  const key = `${ip}:${type}:${userAgent.substring(0, 50)}`;
  const config = rateLimitConfigs[type] || rateLimitConfigs.default;
  const limit = customLimit ?? config.limit;
  const now = Date.now();

  if (!ipRequestStore[key] || ipRequestStore[key].resetAt < now) {
    ipRequestStore[key] = { count: 0, resetAt: now + config.windowSizeInSeconds * 1000 };
  }

  ipRequestStore[key].count++;
  const timeUntilReset = Math.ceil((ipRequestStore[key].resetAt - now) / 1000);
  const limited = ipRequestStore[key].count > limit;
  const remaining = Math.max(0, limit - ipRequestStore[key].count);

  return { limited, limit, remaining, resetAt: ipRequestStore[key].resetAt, retryAfter: limited ? timeUntilReset : 0 };
}

// ─── Honeypot ────────────────────────────────────────────────────────────────

function checkHoneypot(pathname: string, searchParams: URLSearchParams): { isBot: boolean; reason?: string } {
  if (HONEYPOT_PATHS.some((hp) => pathname.includes(hp))) {
    return { isBot: true, reason: "Accessing honeypot path" };
  }
  for (const param of HONEYPOT_PARAMS) {
    if (searchParams.has(param)) {
      return { isBot: true, reason: "Using honeypot query parameter" };
    }
  }
  return { isBot: false };
}

// ─── Browser Fingerprint ─────────────────────────────────────────────────────

function checkBrowserFingerprint(req: IncomingMessage): { isPassing: boolean; score: number; reason?: string } {
  let score = 0;
  const reasons: string[] = [];
  const headers = req.headers;

  const acceptHeader = headers["accept"] as string | undefined;
  if (!acceptHeader) {
    reasons.push("Missing Accept header");
  } else if (acceptHeader.includes("text/html")) {
    score += 2;
  }

  if (headers["accept-language"]) {
    score += 1;
  } else {
    reasons.push("Missing Accept-Language header");
  }

  const userAgent = (headers["user-agent"] as string) || "";
  if (!userAgent) {
    reasons.push("Missing User-Agent header");
  } else if (
    userAgent.includes("Mozilla") &&
    (userAgent.includes("Chrome") || userAgent.includes("Firefox") || userAgent.includes("Safari") || userAgent.includes("Edge"))
  ) {
    score += 3;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname;
  const hasReferer = req.headers["referer"] !== undefined;
  if (path !== "/" && !hasReferer) {
    reasons.push("Missing Referer on internal page");
  } else if (path !== "/" && hasReferer) {
    score += 2;
  }

  const cookieHeader = req.headers["cookie"];
  if (cookieHeader && cookieHeader.length > 0) {
    score += 2;
  }

  const isPassing = score >= 6;
  return { isPassing, score, reason: reasons.length > 0 ? reasons.join(", ") : undefined };
}

// ─── Known Bot ───────────────────────────────────────────────────────────────

function isKnownBot(req: IncomingMessage): boolean {
  const userAgent = (req.headers["user-agent"] || "").toLowerCase();
  const botSignatures = [
    "googlebot", "bingbot", "yandexbot", "duckduckbot", "slurp", "baiduspider",
    "bytespider", "twitterbot", "applebot", "semrushbot", "ahrefsbot", "mj12bot",
    "bot", "crawler", "spider", "scraper", "python-requests", "python",
    "go-http-client", "curl/", "wget/", "httpx", "selenium", "puppeteer",
    "phantom", "headless",
  ];
  return botSignatures.some((sig) => userAgent.includes(sig));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function parseCookies(req: IncomingMessage): Record<string, string> {
  const header = req.headers.cookie || "";
  const cookies: Record<string, string> = {};
  for (const pair of header.split(";")) {
    const [name, ...rest] = pair.trim().split("=");
    if (name) cookies[name] = rest.join("=");
  }
  return cookies;
}

function jsonResponse(res: ServerResponse, status: number, body: unknown, extraHeaders?: Record<string, string>) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    ...extraHeaders,
  });
  res.end(json);
}

function setSessionCookie(res: ServerResponse, token: string) {
  const cookie = `${SESSION_COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Max-Age=${30 * 60}; Path=/`;
  const existing = res.getHeader("Set-Cookie");
  if (existing) {
    const arr = Array.isArray(existing) ? existing : [String(existing)];
    arr.push(cookie);
    res.setHeader("Set-Cookie", arr);
  } else {
    res.setHeader("Set-Cookie", cookie);
  }
}

function clearSessionCookie(res: ServerResponse) {
  res.setHeader("Set-Cookie", `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/`);
}

async function getSession(req: IncomingMessage): Promise<SessionData | null> {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

async function createSessionToken(data: SessionData): Promise<string> {
  const expiresIn = data.exp || Math.floor(Date.now() / 1000) + 30 * 60;
  return new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

function addRateLimitHeaders(res: ServerResponse, rl: RateLimitResult) {
  res.setHeader("X-RateLimit-Limit", rl.limit.toString());
  res.setHeader("X-RateLimit-Remaining", rl.remaining.toString());
  res.setHeader("X-RateLimit-Reset", Math.floor(rl.resetAt / 1000).toString());
}

// ─── Route Handlers ──────────────────────────────────────────────────────────

async function handleCaptchaGenerate(_req: IncomingMessage, res: ServerResponse) {
  const { problem, solution } = generateMathProblem();
  const token = encryptCaptchaSolution(solution);
  jsonResponse(res, 200, {
    problem,
    token,
    instructions: "Solve this math problem to continue. Enter the answer as a number.",
  });
}

async function handleCaptchaVerify(req: IncomingMessage, res: ServerResponse) {
  const rl = checkRateLimit(req, "captcha", 10);
  if (rl.limited) {
    return jsonResponse(res, 429, { error: "Too many attempts" }, {
      "Retry-After": rl.retryAfter.toString(),
    });
  }

  let body: any;
  try {
    body = await parseBody(req);
  } catch {
    return jsonResponse(res, 400, { error: "Invalid request body" });
  }

  const { token, solution } = body;
  if (!token || !solution) {
    return jsonResponse(res, 400, { error: "Missing token or solution" });
  }

  const isValid = verifyCaptchaSolution(token, solution);
  if (!isValid) {
    return jsonResponse(res, 400, { error: "Incorrect solution" });
  }

  const existingSession = await getSession(req);
  const sessionData: SessionData = existingSession || {
    isLoggedIn: false,
    accessLevel: "public",
    captchaPassed: true,
  };
  sessionData.captchaPassed = true;

  const newToken = await createSessionToken(sessionData);
  setSessionCookie(res, newToken);
  jsonResponse(res, 200, { success: true });
}

async function handleMarketPublic(req: IncomingMessage, res: ServerResponse) {
  const rl = checkRateLimit(req, "market");
  if (rl.limited) {
    return jsonResponse(res, 429, { error: "Rate limit exceeded" }, {
      "Retry-After": rl.retryAfter.toString(),
      "X-RateLimit-Limit": rl.limit.toString(),
      "X-RateLimit-Remaining": rl.remaining.toString(),
      "X-RateLimit-Reset": Math.floor(rl.resetAt / 1000).toString(),
    });
  }

  if (isKnownBot(req)) {
    const botRl = checkRateLimit(req, "market", 5);
    if (botRl.limited) {
      return jsonResponse(res, 429, { error: "Bot rate limit exceeded" }, {
        "Retry-After": botRl.retryAfter.toString(),
      });
    }
  }

  const fp = checkBrowserFingerprint(req);
  const marketData = generateMarketData();

  if (!fp.isPassing) {
    res.setHeader("X-Fingerprint-Warning", fp.reason || "Suspicious request pattern");
  }
  addRateLimitHeaders(res, rl);
  jsonResponse(res, 200, marketData);
}

async function handleMarketPremium(req: IncomingMessage, res: ServerResponse) {
  const rl = checkRateLimit(req, "premium");
  if (rl.limited) {
    return jsonResponse(res, 429, { error: "Rate limit exceeded" }, {
      "Retry-After": rl.retryAfter.toString(),
      "X-RateLimit-Limit": rl.limit.toString(),
      "X-RateLimit-Remaining": rl.remaining.toString(),
      "X-RateLimit-Reset": Math.floor(rl.resetAt / 1000).toString(),
    });
  }

  const fp = checkBrowserFingerprint(req);
  if (!fp.isPassing) {
    return jsonResponse(res, 403, { error: "Access denied. Browser verification failed." });
  }

  const session = await getSession(req);
  if (!session || !session.isLoggedIn) {
    return jsonResponse(res, 401, { error: "Authentication required", authRequired: true });
  }
  if (session.accessLevel !== "premium") {
    return jsonResponse(res, 403, { error: "Premium subscription required" });
  }

  const marketData = generateMarketData();
  const premiumData = marketData.map((item) => {
    const symbolCode = item.symbol.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const priceValue = parseFloat(item.price);
    const marketCapMultiplier = (symbolCode % 10) * 100 + 500;
    const circulatingSupplyBase = symbolCode * 1000000 + 50000000;
    const maxSupplyBase = circulatingSupplyBase * 1.5;
    const allTimeHighMultiplier = 1 + (symbolCode % 20) / 10;

    return {
      ...item,
      premium_data: {
        market_cap: priceValue * marketCapMultiplier * 1000000000,
        circulating_supply: circulatingSupplyBase,
        max_supply: maxSupplyBase,
        all_time_high: (priceValue * allTimeHighMultiplier).toFixed(3),
        all_time_high_date: `2022-${(symbolCode % 12) + 1}-${(symbolCode % 28) + 1}T12:00:00Z`,
        price_prediction_24h: (priceValue * (1 + ((symbolCode % 20) - 10) / 100)).toFixed(2),
      },
    };
  });

  addRateLimitHeaders(res, rl);
  jsonResponse(res, 200, premiumData);
}

async function handleOrderbookPublic(req: IncomingMessage, res: ServerResponse) {
  const rl = checkRateLimit(req, "orderbook");
  if (rl.limited) {
    return jsonResponse(res, 429, { error: "Rate limit exceeded" }, {
      "Retry-After": rl.retryAfter.toString(),
      "X-RateLimit-Limit": rl.limit.toString(),
      "X-RateLimit-Remaining": rl.remaining.toString(),
      "X-RateLimit-Reset": Math.floor(rl.resetAt / 1000).toString(),
    });
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const symbol = url.searchParams.get("symbol") || "BTC/USD";
  const orderBookData = generateOrderBook(symbol);

  addRateLimitHeaders(res, rl);
  jsonResponse(res, 200, orderBookData);
}

async function handleOrderbookRestricted(req: IncomingMessage, res: ServerResponse) {
  const rl = checkRateLimit(req, "orderbook");
  if (rl.limited) {
    return jsonResponse(res, 429, { error: "Rate limit exceeded" }, {
      "Retry-After": rl.retryAfter.toString(),
      "X-RateLimit-Limit": rl.limit.toString(),
      "X-RateLimit-Remaining": rl.remaining.toString(),
      "X-RateLimit-Reset": Math.floor(rl.resetAt / 1000).toString(),
    });
  }

  const userAgent = req.headers["user-agent"] || "";
  const robotsTxtCheck = req.headers["x-robots-check"] === "GoodBot";

  if (!robotsTxtCheck && !userAgent.includes("Mozilla")) {
    return jsonResponse(res, 403, { error: "Access denied" });
  }

  const session = await getSession(req);
  if (!robotsTxtCheck && (!session || !session.isLoggedIn)) {
    return jsonResponse(res, 401, { error: "Authentication required", authRequired: true });
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const symbol = url.searchParams.get("symbol") || "BTC/USD";
  const depth = parseInt(url.searchParams.get("depth") || "10", 10);
  const orderBookData = generateOrderBook(symbol);

  const responseBody: Record<string, unknown> = {
    ...orderBookData,
    depth,
    symbol,
    exchange: "CryptoDefend",
    is_restricted: true,
    bids: orderBookData.bids.slice(0, depth),
    asks: orderBookData.asks.slice(0, depth),
  };

  if (robotsTxtCheck || session?.accessLevel === "premium") {
    responseBody.liquidity_score = "0.75";
    responseBody.order_imbalance = "0.25";
  }

  addRateLimitHeaders(res, rl);
  jsonResponse(res, 200, responseBody);
}

async function handleAuthLogin(req: IncomingMessage, res: ServerResponse) {
  const rl = checkRateLimit(req, "auth", 5);
  if (rl.limited) {
    return jsonResponse(res, 429, { error: "Too many login attempts" }, {
      "Retry-After": rl.retryAfter.toString(),
    });
  }

  const fp = checkBrowserFingerprint(req);
  if (!fp.isPassing) {
    return jsonResponse(res, 403, { error: "Browser verification failed" });
  }

  let body: any;
  try {
    body = await parseBody(req);
  } catch {
    return jsonResponse(res, 400, { error: "Invalid request body" });
  }

  const { username, password } = body as { username?: string; password?: string };
  if (!username || !password) {
    return jsonResponse(res, 400, { error: "Missing username or password" });
  }

  if (username !== "demo" && username !== "premium") {
    return jsonResponse(res, 404, { error: "Unknown user" });
  }

  const user = USERS[username];
  if (!user || user.password !== password) {
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
    return jsonResponse(res, 401, { error: "Invalid credentials" });
  }

  const sessionData: SessionData = {
    userId: username,
    username,
    isLoggedIn: true,
    accessLevel: user.accessLevel,
    captchaPassed: true,
  };

  const token = await createSessionToken(sessionData);
  setSessionCookie(res, token);
  jsonResponse(res, 200, {
    success: true,
    user: { username, name: user.name, accessLevel: user.accessLevel },
  });
}

async function handleAuthLogout(_req: IncomingMessage, res: ServerResponse) {
  clearSessionCookie(res);
  jsonResponse(res, 200, { success: true });
}

// ─── Static File Serving ─────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function serveStaticFile(filePath: string, res: ServerResponse): Promise<boolean> {
  try {
    const fullPath = join(__dirname, "public", filePath);
    const data = await readFile(fullPath);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

// ─── Server ──────────────────────────────────────────────────────────────────

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  const method = req.method || "GET";

  // ── Honeypot check ──
  const honeypotResult = checkHoneypot(pathname, url.searchParams);
  if (honeypotResult.isBot) {
    return jsonResponse(res, 403, {
      error: "Access denied",
      reason: "Bot trap triggered",
      detail: honeypotResult.reason,
    });
  }

  // ── Global rate limit (API paths only, matching original middleware behavior) ──
  if (pathname.startsWith("/api/")) {
    const globalRl = checkRateLimit(req, "global", 60);
    if (globalRl.limited) {
      return jsonResponse(res, 429, {
        error: "Too many requests",
        retryAfter: globalRl.retryAfter,
      }, {
        "Retry-After": globalRl.retryAfter.toString(),
        "X-RateLimit-Limit": globalRl.limit.toString(),
        "X-RateLimit-Remaining": globalRl.remaining.toString(),
        "X-RateLimit-Reset": Math.floor(globalRl.resetAt / 1000).toString(),
      });
    }
  }

  // ── CAPTCHA middleware for /api/orderbook/restricted ──
  if (pathname === "/api/orderbook/restricted") {
    const robotsTxtCheck = req.headers["x-robots-check"] === "GoodBot";
    if (!robotsTxtCheck) {
      const session = await getSession(req);
      if (!session?.captchaPassed) {
        return jsonResponse(res, 403, {
          error: "CAPTCHA verification required",
          captchaRequired: true,
        });
      }
    }
  }

  // ── API Routes ──
  if (pathname === "/api/captcha/generate" && method === "GET") {
    return handleCaptchaGenerate(req, res);
  }
  if (pathname === "/api/captcha/verify" && method === "POST") {
    return handleCaptchaVerify(req, res);
  }
  if (pathname === "/api/market/public" && method === "GET") {
    return handleMarketPublic(req, res);
  }
  if (pathname === "/api/market/premium" && method === "GET") {
    return handleMarketPremium(req, res);
  }
  if (pathname === "/api/orderbook/public" && method === "GET") {
    return handleOrderbookPublic(req, res);
  }
  if (pathname === "/api/orderbook/restricted" && method === "GET") {
    return handleOrderbookRestricted(req, res);
  }
  if (pathname === "/api/auth/login" && method === "POST") {
    return handleAuthLogin(req, res);
  }
  if (pathname === "/api/auth/logout" && method === "POST") {
    return handleAuthLogout(req, res);
  }

  // ── Static files ──
  if (pathname === "/") {
    const served = await serveStaticFile("index.html", res);
    if (served) return;
  } else {
    const served = await serveStaticFile(pathname.slice(1), res);
    if (served) return;
  }

  // ── 404 ──
  jsonResponse(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Chapter 11 server running on http://localhost:${PORT}`);
});
