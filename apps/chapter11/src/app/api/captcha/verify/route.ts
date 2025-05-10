import { NextRequest, NextResponse } from "next/server";
import { verifyCaptchaSolution } from "@/lib/captcha";
import {
  getSession,
  createSessionToken,
  setSessionCookie,
} from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  // Rate limiting check to prevent brute force
  const rateLimitResult = await checkRateLimit(request, "captcha", 10);
  if (rateLimitResult.limited) {
    return new NextResponse(JSON.stringify({ error: "Too many attempts" }), {
      status: 429,
      headers: {
        "Retry-After": rateLimitResult.retryAfter.toString(),
        "Content-Type": "application/json",
      },
    });
  }

  // Parse the request
  let body;
  try {
    body = await request.json();
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { token, solution } = body;

  if (!token || !solution) {
    return NextResponse.json(
      { error: "Missing token or solution" },
      { status: 400 },
    );
  }

  // Verify the CAPTCHA solution
  const isValid = verifyCaptchaSolution(token, solution);

  if (!isValid) {
    return NextResponse.json({ error: "Incorrect solution" }, { status: 400 });
  }

  // Get existing session or create a new one
  const existingSession = await getSession(request);
  const sessionData = existingSession || {
    isLoggedIn: false,
    accessLevel: "public",
    captchaPassed: true,
  };

  // Update the session with CAPTCHA verification
  sessionData.captchaPassed = true;

  // Create a new session token
  const newToken = await createSessionToken(sessionData);

  // Create response
  const response = NextResponse.json({ success: true });

  // Set the session cookie
  setSessionCookie(response, newToken);

  return response;
}
