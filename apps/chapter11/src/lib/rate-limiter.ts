import { NextRequest } from "next/server";
import { ipAddress } from "@vercel/functions";

interface RateLimitConfig {
  // Maximum number of requests allowed within the time window
  limit: number;
  // Time window in seconds
  windowSizeInSeconds: number;
}

// In-memory store for rate limiting
// In a production environment, this would use Redis or a similar distributed cache
const ipRequestStore: Record<string, { count: number; resetAt: number }> = {};

// Rate limit configurations for different endpoints
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  market: { limit: 20, windowSizeInSeconds: 60 }, // 20 requests per minute
  orderbook: { limit: 10, windowSizeInSeconds: 60 }, // 10 requests per minute
  premium: { limit: 5, windowSizeInSeconds: 60 }, // 5 requests per minute
  default: { limit: 60, windowSizeInSeconds: 60 }, // 60 requests per minute
};

export interface RateLimitResult {
  limited: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
}

export async function checkRateLimit(
  request: NextRequest,
  type: string = "default",
  customLimit?: number,
): Promise<RateLimitResult> {
  // Get IP address from the request
  // In a production environment, you would handle proxies and load balancers
  const ip = ipAddress(request) ?? "127.0.0.1";
  const userAgent = request.headers.get("user-agent") ?? "";

  // Create a unique key for this IP and endpoint type
  const key = `${ip}:${type}:${userAgent.substring(0, 50)}`;

  // Get config for this rate limit type
  const config = rateLimitConfigs[type] || rateLimitConfigs.default;
  const limit = customLimit || config.limit;

  // Get current time
  const now = Date.now();

  // Initialize or get existing record
  if (!ipRequestStore[key] || ipRequestStore[key].resetAt < now) {
    ipRequestStore[key] = {
      count: 0,
      resetAt: now + config.windowSizeInSeconds * 1000,
    };
  }

  // Increment request count
  ipRequestStore[key].count++;

  // Calculate time remaining until reset
  const timeUntilReset = Math.ceil((ipRequestStore[key].resetAt - now) / 1000);

  // Check if rate limit is exceeded
  const limited = ipRequestStore[key].count > limit;

  // Calculate requests remaining
  const remaining = Math.max(0, limit - ipRequestStore[key].count);

  return {
    limited,
    limit,
    remaining,
    resetAt: ipRequestStore[key].resetAt,
    retryAfter: limited ? timeUntilReset : 0,
  };
}

// Clean up expired rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const key in ipRequestStore) {
    if (ipRequestStore[key].resetAt < now) {
      delete ipRequestStore[key];
    }
  }
}, 60000); // Clean up every minute
