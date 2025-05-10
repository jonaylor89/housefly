"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MarketData {
  symbol: string;
  price: string;
  change_24h: string;
}

export default function Trading() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USD");
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [action, setAction] = useState("buy");
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Simulate fetching market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/market/public");

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        const data = await response.json();
        setMarketData(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load market data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate an API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulated order success
      const currentPrice =
        marketData.find((item) => item.symbol === selectedSymbol)?.price || "0";
      const total = parseFloat(amount) * parseFloat(currentPrice);

      // Show success message
      setSuccess(
        `Successfully ${action === "buy" ? "bought" : "sold"} ${amount} ${selectedSymbol.split("/")[0]} ` +
          `at ${orderType === "market" ? "market" : "limit"} price of $${parseFloat(currentPrice).toFixed(2)} ` +
          `for a total of $${total.toFixed(2)}`,
      );

      // Clear form
      setAmount("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit order. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trading Platform</h1>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Market sidebar */}
        <div className="md:col-span-3">
          <div className="card p-0 overflow-hidden">
            <div className="p-3 bg-primary text-white font-medium">
              Market Overview
            </div>
            <div className="divide-y divide-gray">
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div className="p-3 shimmer h-12" key={index}></div>
                    ))
                : marketData.slice(0, 5).map((item) => (
                    <button
                      key={item.symbol}
                      className={`p-3 w-full text-left hover:bg-gray-light transition-colors ${selectedSymbol === item.symbol ? "bg-gray-light" : ""}`}
                      onClick={() => setSelectedSymbol(item.symbol)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.symbol}</span>
                        <span
                          className={
                            parseFloat(item.change_24h) >= 0
                              ? "crypto-up"
                              : "crypto-down"
                          }
                        >
                          {parseFloat(item.change_24h) >= 0 ? "+" : ""}
                          {item.change_24h}%
                        </span>
                      </div>
                      <div className="text-xl mt-1">
                        ${parseFloat(item.price).toFixed(2)}
                      </div>
                    </button>
                  ))}
            </div>
            <div className="p-3 border-t border-gray">
              <Link
                href="/market"
                className="text-primary text-sm hover:underline"
              >
                View all markets →
              </Link>
            </div>
          </div>

          <div className="mt-6 text-sm">
            <div className="card p-4">
              <h3 className="font-bold text-center mb-3">Trading API Access</h3>
              <p className="mb-3 text-gray-dark">
                The trading API has the strictest rate limits and security
                requirements.
              </p>
              <ul className="space-y-2 list-disc pl-4 text-gray-dark">
                <li>Requires authentication</li>
                <li>Requires CAPTCHA verification</li>
                <li>Implements device fingerprinting</li>
                <li>Protected by rate limiting</li>
              </ul>
              <p className="mt-3 text-xs text-gray-dark">
                This is a demo website. No real trading is performed.
              </p>
            </div>
          </div>
        </div>

        {/* Trading form */}
        <div className="md:col-span-9">
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">
              {selectedSymbol} Trading
            </h2>

            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-md mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success/10 border border-success/20 text-success p-4 rounded-md mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Order type */}
                <div>
                  <label className="block font-medium mb-2">Order Type</label>
                  <div className="flex">
                    <button
                      type="button"
                      className={`flex-1 py-3 rounded-l-md ${orderType === "market" ? "bg-primary text-white" : "bg-gray border border-gray-dark"}`}
                      onClick={() => setOrderType("market")}
                    >
                      Market
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3 rounded-r-md ${orderType === "limit" ? "bg-primary text-white" : "bg-gray border border-gray-dark"}`}
                      onClick={() => setOrderType("limit")}
                    >
                      Limit
                    </button>
                  </div>
                </div>

                {/* Action (Buy/Sell) */}
                <div>
                  <label className="block font-medium mb-2">Action</label>
                  <div className="flex">
                    <button
                      type="button"
                      className={`flex-1 py-3 rounded-l-md ${action === "buy" ? "bg-success text-white" : "bg-gray border border-gray-dark"}`}
                      onClick={() => setAction("buy")}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3 rounded-r-md ${action === "sell" ? "bg-danger text-white" : "bg-gray border border-gray-dark"}`}
                      onClick={() => setAction("sell")}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block font-medium mb-2">
                    Amount ({selectedSymbol.split("/")[0]})
                  </label>
                  <input
                    id="amount"
                    type="number"
                    min="0.0001"
                    step="0.0001"
                    className="input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                {/* Price (for limit orders) */}
                {orderType === "limit" && (
                  <div>
                    <label htmlFor="price" className="block font-medium mb-2">
                      Price (USD)
                    </label>
                    <input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="input"
                      defaultValue={
                        marketData.find(
                          (item) => item.symbol === selectedSymbol,
                        )?.price
                      }
                      required={orderType === "limit"}
                    />
                  </div>
                )}
              </div>

              {/* Current price info */}
              <div className="my-6 p-4 bg-gray-light rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-dark">Current Price:</span>
                    <div className="text-xl font-bold">
                      $
                      {loading
                        ? "---.--"
                        : parseFloat(
                            marketData.find(
                              (item) => item.symbol === selectedSymbol,
                            )?.price || "0",
                          ).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-dark">Estimated Total:</span>
                    <div className="text-xl font-bold">
                      $
                      {amount && !loading
                        ? (
                            parseFloat(amount) *
                            parseFloat(
                              marketData.find(
                                (item) => item.symbol === selectedSymbol,
                              )?.price || "0",
                            )
                          ).toFixed(2)
                        : "---.--"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className={`button w-full py-4 text-lg ${action === "buy" ? "button-success bg-success" : "button-danger bg-danger"}`}
                  disabled={loading || submitLoading}
                >
                  {submitLoading
                    ? "Processing..."
                    : `${action === "buy" ? "Buy" : "Sell"} ${selectedSymbol.split("/")[0]}`}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-gray pt-6 text-sm text-gray-dark">
              <p>
                <strong>Note:</strong> This is a demo application. No real
                transactions are performed.
              </p>
              <p className="mt-2">
                In a real exchange, this form would trigger API calls that would
                be protected by multiple security layers including rate
                limiting, CAPTCHA verification, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
