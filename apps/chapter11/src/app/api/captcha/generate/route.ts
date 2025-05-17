import { NextResponse } from "next/server";
import { generateMathProblem, encryptCaptchaSolution } from "@/lib/captcha";

export async function GET() {
  // Generate a simple math problem
  const { problem, solution } = generateMathProblem();

  // Generate an encrypted token containing the solution
  const token = encryptCaptchaSolution(solution);

  // Return the problem and token
  // In a real implementation with canvas, we'd return an image
  // For this demo, we'll return a text-based problem
  return NextResponse.json({
    problem,
    token,
    instructions:
      "Solve this math problem to continue. Enter the answer as a number.",
  });
}
