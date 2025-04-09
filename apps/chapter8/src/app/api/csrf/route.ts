import { NextResponse } from "next/server";
import crypto from "crypto";

// Simple CSRF token generation for demonstration
export async function GET() {
  // Generate a cryptographically secure random token
  const csrfToken = crypto.randomBytes(32).toString('hex');
  
  // In a real application, you would store this token in a server-side session
  // and verify it on form submission
  
  return NextResponse.json({ csrfToken });
}