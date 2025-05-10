import { NextRequest, NextResponse } from 'next/server';
import { generateOrderBook } from '@/lib/data-generator';
import { checkRateLimit } from '@/lib/rate-limiter';

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
  
  // Get symbol from query params
  const url = new URL(request.url);
  const symbol = url.searchParams.get('symbol') || 'BTC/USD';
  
  // Generate order book data
  const orderBookData = generateOrderBook(symbol);
  
  // Prepare response
  const response = NextResponse.json(orderBookData);
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.floor(rateLimitResult.resetAt / 1000).toString());
  
  return response;
}