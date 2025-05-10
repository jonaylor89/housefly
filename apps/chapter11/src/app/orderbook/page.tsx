"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CaptchaVerify from "@/components/CaptchaVerify";

interface OrderBookEntry {
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
  depth?: number;
  symbol?: string;
  exchange?: string;
  is_restricted?: boolean;
  liquidity_score?: string;
  order_imbalance?: string;
}

export default function OrderBook() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USD");
  const [publicOrderBook, setPublicOrderBook] = useState<OrderBookEntry | null>(null);
  const [restrictedOrderBook, setRestrictedOrderBook] = useState<OrderBookEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restrictedError, setRestrictedError] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [tab, setTab] = useState<"public" | "restricted">("public");

  const symbols = [
    "BTC/USD",
    "ETH/USD",
    "BNB/USD",
    "SOL/USD",
    "ADA/USD",
  ];

  // Fetch public order book data
  useEffect(() => {
    const fetchPublicOrderBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orderbook/public?symbol=${encodeURIComponent(selectedSymbol)}`);

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("Retry-After") || "5", 10);
          setError(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch order book data");
        }

        const data = await response.json();
        setPublicOrderBook(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicOrderBook();
    // Refresh data every 10 seconds
    const interval = setInterval(fetchPublicOrderBook, 10000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  // Fetch restricted order book data
  useEffect(() => {
    const fetchRestrictedOrderBook = async () => {
      try {
        const response = await fetch(`/api/orderbook/restricted?symbol=${encodeURIComponent(selectedSymbol)}&depth=20`);

        if (response.status === 401) {
          setRestrictedError("Login required for restricted data");
          return;
        }

        if (response.status === 403) {
          const data = await response.json();
          if (data.captchaRequired) {
            setShowCaptcha(true);
            setRestrictedError("Please complete the CAPTCHA to access restricted data");
          } else {
            setRestrictedError("Access denied. You don't have permission to view this data.");
          }
          return;
        }

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("Retry-After") || "5", 10);
          setRestrictedError(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch restricted order book data");
        }

        const data = await response.json();
        setRestrictedOrderBook(data);
        setRestrictedError(null);
      } catch (err) {
        setRestrictedError((err as Error).message);
      }
    };

    if (tab === "restricted") {
      fetchRestrictedOrderBook();
    }
  }, [selectedSymbol, tab]);

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    // Reload restricted data after CAPTCHA is completed
    if (tab === "restricted") {
      setRestrictedError(null);
      // Add a small delay to ensure the session is properly updated
      setTimeout(() => {
        fetch(`/api/orderbook/restricted?symbol=${encodeURIComponent(selectedSymbol)}&depth=20`)
          .then(response => {
            if (response.ok) return response.json();
            throw new Error("Failed to fetch restricted order book data");
          })
          .then(data => {
            setRestrictedOrderBook(data);
          })
          .catch(err => {
            setRestrictedError(err.message);
          });
      }, 500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Book</h1>

      <div className="mb-6">
        <label htmlFor="symbol-select" className="block mb-2 font-medium">
          Select Trading Pair:
        </label>
        <select
          id="symbol-select"
          className="input max-w-xs"
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
        >
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray mb-6">
        <button
          className={`py-2 px-4 font-medium ${tab === "public" ? "border-b-2 border-primary text-primary" : "text-gray-dark"}`}
          onClick={() => setTab("public")}
        >
          Public Order Book
        </button>
        <button
          className={`py-2 px-4 font-medium ${tab === "restricted" ? "border-b-2 border-primary text-primary" : "text-gray-dark"}`}
          onClick={() => setTab("restricted")}
        >
          Restricted Order Book
        </button>
      </div>

      {/* Public order book tab */}
      {tab === "public" && (
        <>
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading || !publicOrderBook ? (
            <div className="card shimmer h-64"></div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="p-4 bg-primary text-white font-medium">
                {selectedSymbol} Order Book
              </div>
              <div className="order-book p-4">
                <div>
                  <div className="font-medium mb-2 text-center">Bids</div>
                  <div className="order-book-bids">
                    {publicOrderBook.bids.slice(0, 10).map((bid, index) => (
                      <div key={index} className="order-book-row">
                        <div 
                          className="order-book-row-fill bg-success"
                          style={{ 
                            width: `${Math.min(parseFloat(bid[1]) * 5, 100)}%`,
                          }}
                        ></div>
                        <span>{bid[0]}</span>
                        <span>{bid[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2 text-center">Asks</div>
                  <div className="order-book-asks">
                    {publicOrderBook.asks.slice(0, 10).map((ask, index) => (
                      <div key={index} className="order-book-row">
                        <div 
                          className="order-book-row-fill bg-danger"
                          style={{ 
                            width: `${Math.min(parseFloat(ask[1]) * 5, 100)}%`,
                          }}
                        ></div>
                        <span>{ask[0]}</span>
                        <span>{ask[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-gray text-sm text-gray-dark">
                Last updated: {new Date(publicOrderBook.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Public Order Book API</h3>
            <div className="card p-6">
              <p className="mb-4">
                This endpoint has the following rate limits and restrictions:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Rate limit: <code>10 requests per minute</code></li>
                <li>Accessible without authentication</li>
                <li>Limited depth of order book (10 levels)</li>
                <li>Available at: <code>/api/orderbook/public?symbol=BTC/USD</code></li>
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Restricted order book tab */}
      {tab === "restricted" && (
        <>
          {restrictedError && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-md mb-6">
              {restrictedError}
              {restrictedError.includes("Login required") && (
                <div className="mt-2">
                  <Link href="/login" className="button button-primary inline-block mt-2 text-sm">
                    Login to Access
                  </Link>
                </div>
              )}
            </div>
          )}

          {showCaptcha && (
            <div className="mb-6">
              <CaptchaVerify onSuccess={handleCaptchaSuccess} />
            </div>
          )}

          {!restrictedError && restrictedOrderBook ? (
            <div className="card p-0 overflow-hidden">
              <div className="p-4 bg-primary text-white font-medium flex justify-between items-center">
                <span>{selectedSymbol} Restricted Order Book</span>
                {restrictedOrderBook.liquidity_score && (
                  <div className="text-sm bg-white/10 rounded-full px-3 py-1">
                    Liquidity Score: {restrictedOrderBook.liquidity_score}
                  </div>
                )}
              </div>
              <div className="order-book p-4">
                <div>
                  <div className="font-medium mb-2 text-center">Bids</div>
                  <div className="order-book-bids">
                    {restrictedOrderBook.bids.map((bid, index) => (
                      <div key={index} className="order-book-row">
                        <div 
                          className="order-book-row-fill bg-success"
                          style={{ 
                            width: `${Math.min(parseFloat(bid[1]) * 5, 100)}%`,
                          }}
                        ></div>
                        <span>{bid[0]}</span>
                        <span>{bid[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2 text-center">Asks</div>
                  <div className="order-book-asks">
                    {restrictedOrderBook.asks.map((ask, index) => (
                      <div key={index} className="order-book-row">
                        <div 
                          className="order-book-row-fill bg-danger"
                          style={{ 
                            width: `${Math.min(parseFloat(ask[1]) * 5, 100)}%`,
                          }}
                        ></div>
                        <span>{ask[0]}</span>
                        <span>{ask[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-gray flex justify-between items-center">
                <div className="text-sm text-gray-dark">
                  Last updated: {new Date(restrictedOrderBook.timestamp).toLocaleTimeString()}
                </div>
                {restrictedOrderBook.order_imbalance && (
                  <div className="text-sm font-medium">
                    Order Imbalance: <span className={parseFloat(restrictedOrderBook.order_imbalance) >= 0 ? "crypto-up" : "crypto-down"}>
                      {restrictedOrderBook.order_imbalance}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : !restrictedError ? (
            <div className="card shimmer h-64"></div>
          ) : null}

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Restricted Order Book API</h3>
            <div className="card p-6">
              <p className="mb-4">
                This endpoint has the following rate limits and restrictions:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Rate limit: <code>10 requests per minute</code></li>
                <li>Requires CAPTCHA verification</li>
                <li>May require authentication for some data</li>
                <li>Full depth order book (20 levels)</li>
                <li>Includes additional market metrics</li>
                <li>Available at: <code>/api/orderbook/restricted?symbol=BTC/USD&depth=20</code></li>
                <li>Respects robots.txt - special access for compliant bots with <code>x-robots-check: GoodBot</code> header</li>
              </ul>

              <div className="mt-4 p-3 bg-secondary/10 rounded-md text-sm">
                <strong>Advanced Access Method (for bots):</strong>
                <p className="mt-2">
                  This endpoint can be accessed without CAPTCHA by bots that respect robots.txt and 
                  correctly identify themselves with the special header mentioned in robots.txt.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}