import { NextRequest, NextResponse } from 'next/server';
import { generateMarketData } from '@/lib/data-generator';
import { checkRateLimit } from '@/lib/rate-limiter';
import { isKnownBot } from '@/lib/honeypot';
import { checkBrowserFingerprint } from '@/lib/fingerprint';

export async function GET(request: NextRequest) {
  // Rate limiting check
  const rateLimitResult = await checkRateLimit(request, 'market');
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
  
  // Known bot check (bots can access this public endpoint, but we might rate limit them differently)
  if (isKnownBot(request)) {
    const botRateLimitResult = await checkRateLimit(request, 'market', 5); // Stricter limit for known bots
    if (botRateLimitResult.limited) {
      return new NextResponse(JSON.stringify({ error: 'Bot rate limit exceeded' }), {
        status: 429,
        headers: {
          'Retry-After': botRateLimitResult.retryAfter.toString(),
          'Content-Type': 'application/json',
        }
      });
    }
  }
  
  // Browser fingerprint check - for educational purposes, we'll still allow
  // requests that fail but add a warning header
  const fingerprintResult = checkBrowserFingerprint(request);
  
  // Generate market data
  const marketData = generateMarketData();
  
  // Prepare response
  const response = NextResponse.json(marketData);
  
  // Add fingerprint check result as header (for learning purposes)
  if (!fingerprintResult.isPassing) {
    response.headers.set('X-Fingerprint-Warning', fingerprintResult.reason || 'Suspicious request pattern');
  }
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.floor(rateLimitResult.resetAt / 1000).toString());
  
  return response;
}