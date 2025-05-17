import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { checkBrowserFingerprint } from "@/lib/fingerprint";

// Demo user database (in a real app, this would be in a database)
const USERS = {
  demo: {
    password: "password123",
    name: "Demo User",
    accessLevel: "basic",
  },
  premium: {
    password: "premium123",
    name: "Premium User",
    accessLevel: "premium",
  },
};

export async function POST(request: NextRequest) {
  // Rate limiting check to prevent brute force
  const rateLimitResult = await checkRateLimit(request, "auth", 5);
  if (rateLimitResult.limited) {
    return new NextResponse(
      JSON.stringify({ error: "Too many login attempts" }),
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitResult.retryAfter.toString(),
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Browser fingerprint check
  const fingerprintResult = checkBrowserFingerprint(request);
  if (!fingerprintResult.isPassing) {
    return NextResponse.json(
      { error: "Browser verification failed" },
      { status: 403 },
    );
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

  const { username, password } = body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return NextResponse.json(
      { error: "Missing username or password" },
      { status: 400 },
    );
  }

  if (username !== "demo" && username !== "premium") {
    return NextResponse.json({ error: "Unknown user" }, { status: 404 });
  }

  // Check credentials
  const user = USERS[username] as
    | {
        password: string;
        name: string;
        accessLevel: "basic" | "premium" | "public";
      }
    | undefined;
  if (!user || user.password !== password) {
    // Delay response to prevent timing attacks
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 500),
    );

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Create session
  const sessionData = {
    userId: username,
    username: username,
    isLoggedIn: true,
    accessLevel: user.accessLevel,
    captchaPassed: true,
  };

  // Create a new session token
  const token = await createSessionToken(sessionData);

  // Create response
  const response = NextResponse.json({
    success: true,
    user: {
      username,
      name: user.name,
      accessLevel: user.accessLevel,
    },
  });

  // Set the session cookie
  setSessionCookie(response, token);

  return response;
}
