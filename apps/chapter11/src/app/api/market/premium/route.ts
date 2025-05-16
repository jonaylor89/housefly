import { NextRequest, NextResponse } from "next/server";
import { generateMarketData } from "@/lib/data-generator";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getSession } from "@/lib/session";
import { checkBrowserFingerprint } from "@/lib/fingerprint";

export async function GET(request: NextRequest) {
  // Rate limiting check - stricter limit for premium data
  const rateLimitResult = await checkRateLimit(request, "premium");
  if (rateLimitResult.limited) {
    return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
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
    });
  }

  // Browser fingerprint check - premium data requires a more reliable browser fingerprint
  const fingerprintResult = checkBrowserFingerprint(request);
  if (!fingerprintResult.isPassing) {
    return NextResponse.json(
      { error: "Access denied. Browser verification failed." },
      { status: 403 },
    );
  }

  // Session check - premium data requires authentication
  const session = await getSession(request);
  if (!session || !session.isLoggedIn) {
    return NextResponse.json(
      { error: "Authentication required", authRequired: true },
      { status: 401 },
    );
  }

  // Access level check - premium data requires premium access
  if (session.accessLevel !== "premium") {
    return NextResponse.json(
      { error: "Premium subscription required" },
      { status: 403 },
    );
  }

  // Generate premium market data (includes additional fields)
  const marketData = generateMarketData();

  // Add premium data fields with deterministic values
  const premiumData = marketData.map((item) => {
    // Use symbol to create deterministic values (hash-like approach)
    const symbolCode = item.symbol
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const priceValue = parseFloat(item.price);

    // Calculate deterministic values based on symbol and price
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
        price_prediction_24h: (
          priceValue *
          (1 + ((symbolCode % 20) - 10) / 100)
        ).toFixed(2),
      },
    };
  });

  // Prepare response
  const response = NextResponse.json(premiumData);

  // Add rate limit headers
  response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    rateLimitResult.remaining.toString(),
  );
  response.headers.set(
    "X-RateLimit-Reset",
    Math.floor(rateLimitResult.resetAt / 1000).toString(),
  );

  return response;
}
