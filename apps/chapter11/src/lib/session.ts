import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// In a real application, these would be secure environment variables
const JWT_SECRET = new TextEncoder().encode("crypto-defend-jwt-secret-key");
const SESSION_COOKIE_NAME = "crypto_defend_session";

export interface SessionData {
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
  accessLevel: "public" | "basic" | "premium";
  captchaPassed?: boolean;
  exp?: number;
}

// Create a new session token
export async function createSessionToken(data: SessionData): Promise<string> {
  // Sessions expire in 30 minutes by default
  const expiresIn = data.exp || Math.floor(Date.now() / 1000) + 30 * 60;

  // Create and sign the JWT
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);

  return token;
}

// Set the session cookie in a response
export function setSessionCookie(
  response: NextResponse,
  token: string,
): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 60, // 30 minutes
    path: "/",
  });

  return response;
}

// Get and verify the session from a request
export async function getSession(
  request: NextRequest,
): Promise<SessionData | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionData;
  } catch (error) {
    // Token is invalid or expired
    console.error(error);
    return null;
  }
}

// Get the session from the server component context
export async function getServerSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Clear the session cookie
export function clearSession(response: NextResponse): NextResponse {
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
