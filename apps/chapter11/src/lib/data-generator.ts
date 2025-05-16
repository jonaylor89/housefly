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
    "BTC/USD",
    "ETH/USD",
    "BNB/USD",
    "SOL/USD",
    "ADA/USD",
    "XRP/USD",
    "DOT/USD",
    "DOGE/USD",
    "AVAX/USD",
    "MATIC/USD",
  ];

  // Constant market data for demonstration purposes
  const constantData: Record<string, MarketData> = {
    "BTC/USD": {
      symbol: "BTC/USD",
      price: "36750.00",
      change_24h: "2.14",
      volume_24h: 850000,
      high_24h: "37200.00",
      low_24h: "35800.00",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "ETH/USD": {
      symbol: "ETH/USD",
      price: "2050.00",
      change_24h: "1.25",
      volume_24h: 650000,
      high_24h: "2080.00",
      low_24h: "1980.00",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "BNB/USD": {
      symbol: "BNB/USD",
      price: "310.50",
      change_24h: "3.50",
      volume_24h: 450000,
      high_24h: "315.00",
      low_24h: "298.00",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "SOL/USD": {
      symbol: "SOL/USD",
      price: "47.25",
      change_24h: "4.75",
      volume_24h: 350000,
      high_24h: "48.10",
      low_24h: "44.20",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "ADA/USD": {
      symbol: "ADA/USD",
      price: "0.52",
      change_24h: "3.10",
      volume_24h: 250000,
      high_24h: "0.53",
      low_24h: "0.49",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "XRP/USD": {
      symbol: "XRP/USD",
      price: "0.62",
      change_24h: "2.80",
      volume_24h: 300000,
      high_24h: "0.64",
      low_24h: "0.59",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "DOT/USD": {
      symbol: "DOT/USD",
      price: "7.20",
      change_24h: "-1.20",
      volume_24h: 180000,
      high_24h: "7.40",
      low_24h: "7.10",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "DOGE/USD": {
      symbol: "DOGE/USD",
      price: "0.11",
      change_24h: "10.00",
      volume_24h: 500000,
      high_24h: "0.12",
      low_24h: "0.10",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "AVAX/USD": {
      symbol: "AVAX/USD",
      price: "26.75",
      change_24h: "3.25",
      volume_24h: 210000,
      high_24h: "27.50",
      low_24h: "25.80",
      updated_at: "2023-05-01T12:00:00Z",
    },
    "MATIC/USD": {
      symbol: "MATIC/USD",
      price: "1.05",
      change_24h: "-0.75",
      volume_24h: 280000,
      high_24h: "1.08",
      low_24h: "1.02",
      updated_at: "2023-05-01T12:00:00Z",
    },
  };

  return pairs.map((pair) => constantData[pair]);
}

function getBasePrice(pair: string): number {
  const prices: Record<string, number> = {
    "BTC/USD": 35000,
    "ETH/USD": 2000,
    "BNB/USD": 300,
    "SOL/USD": 45,
    "ADA/USD": 0.5,
    "XRP/USD": 0.6,
    "DOT/USD": 7,
    "DOGE/USD": 0.1,
    "AVAX/USD": 25,
    "MATIC/USD": 1,
  };

  return prices[pair] || 100;
}

export function generateOrderBook(symbol: string) {
  // Constant order book data for demonstration purposes
  const constantOrderBooks: Record<
    string,
    { bids: [string, string][]; asks: [string, string][]; timestamp: number }
  > = {
    "BTC/USD": {
      bids: [
        ["36700.00", "1.2500"],
        ["36650.00", "0.7500"],
        ["36600.00", "2.1000"],
        ["36550.00", "1.8000"],
        ["36500.00", "3.2500"],
        ["36450.00", "1.5000"],
        ["36400.00", "2.8000"],
        ["36350.00", "1.1000"],
        ["36300.00", "4.2000"],
        ["36250.00", "2.5000"],
        ["36200.00", "3.0000"],
        ["36150.00", "1.2000"],
        ["36100.00", "5.5000"],
        ["36050.00", "2.3000"],
        ["36000.00", "8.0000"],
        ["35950.00", "3.4000"],
        ["35900.00", "2.7000"],
        ["35850.00", "1.9000"],
        ["35800.00", "3.8000"],
        ["35750.00", "2.2000"],
      ],
      asks: [
        ["36800.00", "1.3500"],
        ["36850.00", "0.9500"],
        ["36900.00", "2.4000"],
        ["36950.00", "1.6000"],
        ["37000.00", "5.1000"],
        ["37050.00", "1.8000"],
        ["37100.00", "2.2000"],
        ["37150.00", "1.0000"],
        ["37200.00", "3.2000"],
        ["37250.00", "2.1000"],
        ["37300.00", "2.8000"],
        ["37350.00", "1.5000"],
        ["37400.00", "4.5000"],
        ["37450.00", "2.0000"],
        ["37500.00", "7.5000"],
        ["37550.00", "3.0000"],
        ["37600.00", "2.5000"],
        ["37650.00", "1.7000"],
        ["37700.00", "3.5000"],
        ["37750.00", "2.0000"],
      ],
      timestamp: 1682942400000, // 2023-05-01T12:00:00Z
    },
  };

  // If we have constant data for this symbol, use it
  if (constantOrderBooks[symbol]) {
    return constantOrderBooks[symbol];
  }

  // Otherwise, generate a simple constant order book based on base price
  const basePrice = getBasePrice(symbol);
  const bids: [string, string][] = [];
  const asks: [string, string][] = [];

  // Generate 20 constant bids (below current price)
  for (let i = 0; i < 20; i++) {
    const priceDelta = (i + 1) * 0.15; // 0.15% below for each step
    const price = (basePrice * (1 - priceDelta / 100)).toFixed(3);
    const amount = (2 + (i % 5)).toFixed(4);
    bids.push([price, amount]);
  }

  // Generate 20 constant asks (above current price)
  for (let i = 0; i < 20; i++) {
    const priceDelta = (i + 1) * 0.15; // 0.15% above for each step
    const price = (basePrice * (1 + priceDelta / 100)).toFixed(3);
    const amount = (2 + (i % 5)).toFixed(4);
    asks.push([price, amount]);
  }

  // Sort bids in descending order (highest first)
  bids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));

  // Sort asks in ascending order (lowest first)
  asks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

  return {
    bids,
    asks,
    timestamp: 1682942400000, // 2023-05-01T12:00:00Z
  };
}
