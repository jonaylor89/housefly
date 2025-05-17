import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export async function POST() {
  // Create response
  const response = NextResponse.json({ success: true });

  // Clear the session cookie
  clearSession(response);

  return response;
}
