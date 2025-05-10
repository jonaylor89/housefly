// This middleware handles all the global rate limiting, session, and security checks
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { checkHoneypot } from "@/lib/honeypot";
import { getSession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and special routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".svg") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Check for honeypot traps
  const honeypotResult = checkHoneypot(request);
  if (honeypotResult.isBot) {
    // For educational purposes, respond with 403 and a message
    // In a real production system, you might want to redirect or serve fake data
    return new NextResponse(
      JSON.stringify({
        error: "Access denied",
        reason: "Bot trap triggered",
        detail: honeypotResult.reason,
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Apply global rate limiting for all requests
  const rateLimitResult = await checkRateLimit(request, "global", 60); // 60 requests per minute globally
  if (rateLimitResult.limited) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        retryAfter: rateLimitResult.retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitResult.retryAfter.toString(),
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": Math.floor(
            rateLimitResult.resetAt / 1000,
          ).toString(),
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Check authentication for protected routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/api/private")
  ) {
    const session = await getSession(request);

    if (!session || !session.isLoggedIn) {
      // Redirect to login for page requests
      if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/account")
      ) {
        const url = new URL("/login", request.url);
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
      }

      // Return 401 for API requests
      if (pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({
            error: "Authentication required",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
    }
  }

  // Check CAPTCHA verification for sensitive operations
  if (pathname.startsWith("/api/orderbook/restricted")) {
    const session = await getSession(request);
    const userAgent = request.headers.get("user-agent") || "";
    const robotsTxtCheck = request.headers.get("x-robots-check") === "GoodBot";
    console.log({ userAgent, robotsTxtCheck });

    // Skip CAPTCHA check for properly identified bots
    if (!robotsTxtCheck && !session?.captchaPassed) {
      return new NextResponse(
        JSON.stringify({
          error: "CAPTCHA verification required",
          captchaRequired: true,
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }

  return NextResponse.next();
}

// Specify which paths should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
