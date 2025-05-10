import seedrandom from 'seedrandom';

// Use deterministic randomness for predictable but realistic data
const rng = seedrandom('crypto-defend-seed');

export interface MarketData {
  symbol: string;
  price: string;
  change_24h: string;
  volume_24h: number;
  high_24h: string;
  low_24h: string;
  updated_at: string;
}

export function generateMarketData(): MarketData[] {
  const pairs = [
    'BTC/USD', 'ETH/USD', 'BNB/USD', 'SOL/USD', 'ADA/USD',
    'XRP/USD', 'DOT/USD', 'DOGE/USD', 'AVAX/USD', 'MATIC/USD'
  ];
  
  return pairs.map(pair => {
    const basePrice = getBasePrice(pair);
    const changePercent = (rng() * 10 - 5).toFixed(2); // -5% to +5%
    const volume = Math.floor(rng() * 1000000) + 100000;
    
    return {
      symbol: pair,
      price: (basePrice * (1 + parseFloat(changePercent) / 100)).toFixed(2),
      change_24h: changePercent,
      volume_24h: volume,
      high_24h: (basePrice * (1 + (rng() * 7) / 100)).toFixed(2),
      low_24h: (basePrice * (1 - (rng() * 3) / 100)).toFixed(2),
      updated_at: new Date().toISOString()
    };
  });
}

function getBasePrice(pair: string): number {
  const prices: Record<string, number> = {
    'BTC/USD': 35000,
    'ETH/USD': 2000,
    'BNB/USD': 300,
    'SOL/USD': 45,
    'ADA/USD': 0.5,
    'XRP/USD': 0.6,
    'DOT/USD': 7,
    'DOGE/USD': 0.1,
    'AVAX/USD': 25,
    'MATIC/USD': 1
  };
  
  return prices[pair] || 100;
}

export function generateOrderBook(symbol: string) {
  const basePrice = getBasePrice(symbol);
  const bids: [string, string][] = [];
  const asks: [string, string][] = [];
  
  // Generate 20 bids (below current price)
  for (let i = 0; i < 20; i++) {
    const priceDelta = (i + 1) * (rng() * 0.1 + 0.1); // 0.1% to 0.2% below for each step
    const price = (basePrice * (1 - priceDelta / 100)).toFixed(2);
    const amount = (rng() * 10 + 0.1).toFixed(4);
    bids.push([price, amount]);
  }
  
  // Generate 20 asks (above current price)
  for (let i = 0; i < 20; i++) {
    const priceDelta = (i + 1) * (rng() * 0.1 + 0.1); // 0.1% to 0.2% above for each step
    const price = (basePrice * (1 + priceDelta / 100)).toFixed(2);
    const amount = (rng() * 10 + 0.1).toFixed(4);
    asks.push([price, amount]);
  }
  
  // Sort bids in descending order (highest first)
  bids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
  
  // Sort asks in ascending order (lowest first)
  asks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  
  return {
    bids,
    asks,
    timestamp: Date.now(),
  };
}