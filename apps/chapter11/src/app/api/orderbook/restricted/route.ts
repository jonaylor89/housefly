import { NextRequest, NextResponse } from 'next/server';
import { generateOrderBook } from '@/lib/data-generator';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  // Rate limiting check
  const rateLimitResult = await checkRateLimit(request, 'orderbook');
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
  
  // User-Agent check (only allow browser or specific user-agent)
  const userAgent = request.headers.get('user-agent') || '';
  const robotsTxtCheck = request.headers.get('x-robots-check') === 'GoodBot';
  
  if (!robotsTxtCheck && !userAgent.includes('Mozilla')) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }
  
  // Session check (optional for robots.txt compliant bots)
  const session = await getSession(request);
  if (!robotsTxtCheck && (!session || !session.isLoggedIn)) {
    return NextResponse.json(
      { error: 'Authentication required', authRequired: true },
      { status: 401 }
    );
  }
  
  // Get symbol from query params
  const url = new URL(request.url);
  const symbol = url.searchParams.get('symbol') || 'BTC/USD';
  const depth = parseInt(url.searchParams.get('depth') || '10', 10);
  
  // Generate order book data
  const orderBookData = generateOrderBook(symbol);
  
  // Full data for robots.txt compliant bots or logged-in users
  const response = NextResponse.json({
    ...orderBookData,
    depth: depth,
    symbol: symbol,
    exchange: 'CryptoDefend',
    is_restricted: true,
    bids: orderBookData.bids.slice(0, depth),
    asks: orderBookData.asks.slice(0, depth),
    // Only show this data to robots.txt compliant bots or premium users
    liquidity_score: robotsTxtCheck || (session?.accessLevel === 'premium') ? Math.random().toFixed(2) : undefined,
    order_imbalance: robotsTxtCheck || (session?.accessLevel === 'premium') ? (Math.random() * 2 - 1).toFixed(2) : undefined,
  });
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.floor(rateLimitResult.resetAt / 1000).toString());
  
  return response;
}