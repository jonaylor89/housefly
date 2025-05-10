# Chapter 11: Web Scraping Defenses

## Overview

This chapter focuses on handling common web scraping defenses. The CryptoDefend Exchange is a fictional cryptocurrency trading platform that implements various anti-scraping mechanisms typically found on real websites.

## Learning Objectives

- Understand and respect robots.txt directives
- Implement proper rate limiting strategies
- Handle and solve CAPTCHAs programmatically
- Detect and bypass anti-bot mechanisms
- Implement ethical scraping practices

## The Challenge

Your task is to scrape the complete market data from the CryptoDefend Exchange, including both public and restricted data. This will require overcoming several layers of protection:

1. **Rate Limiting** - The API endpoints restrict the number of requests per minute
2. **CAPTCHA Verification** - Some endpoints require solving a mathematical CAPTCHA
3. **Authentication** - Premium data requires login credentials
4. **robots.txt Compliance** - Some data is only accessible to bots that respect robots.txt directives

## Getting Started

1. Start the development server:

```bash
cd apps/chapter11
npm run dev
```

2. Visit http://localhost:3000 to explore the exchange website

## Key Endpoints

### Public Endpoints
- `/api/market/public` - Basic market data (rate limited to 20 requests/minute)
- `/api/orderbook/public?symbol=BTC/USD` - Public order book data (rate limited to 10 requests/minute)

### Protected Endpoints
- `/api/market/premium` - Premium market data (requires authentication)
- `/api/orderbook/restricted?symbol=BTC/USD&depth=20` - Restricted order book data (requires CAPTCHA or special access)

## Test Accounts

For testing authentication:
- **Basic Account**: Username: `demo`, Password: `password123`
- **Premium Account**: Username: `premium`, Password: `premium123`

## Challenge Requirements

Your scraper should:

1. Respect the robots.txt directives
2. Implement proper rate limiting with exponential backoff
3. Solve the mathematical CAPTCHAs programmatically
4. Handle authentication flows
5. Retrieve and combine data from all endpoints
6. Format the data according to the expected output

## Advanced Challenge

For an extra challenge, discover the hidden access method in the robots.txt file that allows bots to access restricted data without solving CAPTCHAs.

## Expected Output

Your solution should produce a JSON file containing:

1. Complete market data for all trading pairs
2. Order book data with depth of 20 levels for each pair
3. All available metadata including liquidity scores and order imbalance metrics

## Hints

- Examine the robots.txt file carefully for clues
- Use the browser's developer tools to analyze request/response patterns
- Implement exponential backoff when encountering 429 responses
- Mathematical CAPTCHAs follow a simple pattern that can be parsed and solved programmatically

## Ethical Considerations

This challenge is designed for educational purposes. The skills learned should be applied ethically and in compliance with websites' terms of service in real-world scenarios.

## Solution

A reference solution can be found in the `_solved/chapter11` directory.