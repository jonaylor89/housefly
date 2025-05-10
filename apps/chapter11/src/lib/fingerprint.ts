import { NextRequest } from "next/server";

interface FingerprintCheckResult {
  isPassing: boolean;
  score: number;
  reason?: string;
}

export function checkBrowserFingerprint(
  request: NextRequest,
): FingerprintCheckResult {
  let score = 0;
  // const maxScore = 10;
  const reasons: string[] = [];

  const headers = request.headers;

  // Check for accept header (browsers typically have this)
  const acceptHeader = headers.get("accept");
  if (!acceptHeader) {
    reasons.push("Missing Accept header");
  } else if (acceptHeader.includes("text/html")) {
    score += 2;
  }

  // Check for accept-language header
  if (headers.get("accept-language")) {
    score += 1;
  } else {
    reasons.push("Missing Accept-Language header");
  }

  // Check for reasonable user-agent
  const userAgent = headers.get("user-agent") || "";
  if (!userAgent) {
    reasons.push("Missing User-Agent header");
  } else if (
    userAgent.includes("Mozilla") &&
    (userAgent.includes("Chrome") ||
      userAgent.includes("Firefox") ||
      userAgent.includes("Safari") ||
      userAgent.includes("Edge"))
  ) {
    score += 3;
  }

  // Check for referer on non-homepage requests
  const path = new URL(request.url).pathname;
  const hasReferer = headers.get("referer") !== null;
  if (path !== "/" && !hasReferer) {
    reasons.push("Missing Referer on internal page");
  } else if (path !== "/" && hasReferer) {
    score += 2;
  }

  // Check for consistent cookies (browser sessions typically maintain cookies)
  if (request.cookies.size > 0) {
    score += 2;
  }

  // Check result
  const isPassing = score >= 6; // 60% threshold for passing

  return {
    isPassing,
    score,
    reason: reasons.length > 0 ? reasons.join(", ") : undefined,
  };
}
