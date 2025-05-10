import { NextRequest } from 'next/server';

const HONEYPOT_PATHS = [
  '/admin-login',
  '/internal-api',
  '/scraper-trap',
  '/.env',
  '/admin',
  '/wp-login.php',
  '/wp-admin',
  '/config',
];

const HONEYPOT_PARAMS = [
  'debug',
  'access_token',
  'admin',
  'robot',
  'spider'
];

interface HoneypotCheckResult {
  isBot: boolean;
  reason?: string;
}

export function checkHoneypot(request: NextRequest): HoneypotCheckResult {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Check if the request is for a honeypot path
  if (HONEYPOT_PATHS.some(honeypotPath => path.includes(honeypotPath))) {
    return {
      isBot: true,
      reason: 'Accessing honeypot path'
    };
  }
  
  // Check for honeypot query parameters
  for (const param of HONEYPOT_PARAMS) {
    if (url.searchParams.has(param)) {
      return {
        isBot: true,
        reason: 'Using honeypot query parameter'
      };
    }
  }
  
  // Check for hidden form inputs (if it's a form submission)
  const contentType = request.headers.get('content-type');
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    // This would need request body parsing which isn't directly accessible in edge middleware
    // In a real implementation, you would check this in the route handler
  }
  
  return { isBot: false };
}

// Bot detection based on user agent
export function isKnownBot(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  // List of common bot user agents
  const botSignatures = [
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    'baiduspider',
    'bytespider',
    'twitterbot',
    'applebot',
    'semrushbot',
    'ahrefsbot',
    'mj12bot',
    'bot',
    'crawler',
    'spider',
    'scraper',
    'python-requests',
    'python',
    'go-http-client',
    'curl/',
    'wget/',
    'httpx',
    'selenium',
    'puppeteer',
    'phantom',
    'headless',
  ];
  
  return botSignatures.some(signature => userAgent.includes(signature));
}