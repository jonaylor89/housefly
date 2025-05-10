import { NextRequest, NextResponse } from 'next/server';
import { generateMarketData } from '@/lib/data-generator';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getSession } from '@/lib/session';
import { checkBrowserFingerprint } from '@/lib/fingerprint';

export async function GET(request: NextRequest) {
  // Rate limiting check - stricter limit for premium data
  const rateLimitResult = await checkRateLimit(request, 'premium');
  if (rateLimitResult.limited) {
    return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: {
        'Retry-After': rateLimitResult.retryAfter.toString(),
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': Math.floor(rateLimitResult.resetAt / 1000).toString(),
        'Content-Type': 'application/json',
      }
    });
  }
  
  // Browser fingerprint check - premium data requires a more reliable browser fingerprint
  const fingerprintResult = checkBrowserFingerprint(request);
  if (!fingerprintResult.isPassing) {
    return NextResponse.json(
      { error: 'Access denied. Browser verification failed.' },
      { status: 403 }
    );
  }
  
  // Session check - premium data requires authentication
  const session = await getSession(request);
  if (!session || !session.isLoggedIn) {
    return NextResponse.json(
      { error: 'Authentication required', authRequired: true },
      { status: 401 }
    );
  }
  
  // Access level check - premium data requires premium access
  if (session.accessLevel !== 'premium') {
    return NextResponse.json(
      { error: 'Premium subscription required' },
      { status: 403 }
    );
  }
  
  // Generate premium market data (includes additional fields)
  const marketData = generateMarketData();
  
  // Add premium data fields
  const premiumData = marketData.map(item => ({
    ...item,
    premium_data: {
      market_cap: Math.floor(Math.random() * 1000000000000),
      circulating_supply: Math.floor(Math.random() * 1000000000),
      max_supply: Math.floor(Math.random() * 2000000000),
      all_time_high: (parseFloat(item.price) * (1 + Math.random())).toFixed(2),
      all_time_high_date: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      price_prediction_24h: (parseFloat(item.price) * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2),
    }
  }));
  
  // Prepare response
  const response = NextResponse.json(premiumData);
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.floor(rateLimitResult.resetAt / 1000).toString());
  
  return response;
}