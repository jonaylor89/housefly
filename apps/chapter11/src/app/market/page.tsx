"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CaptchaVerify from "@/components/CaptchaVerify";

interface MarketData {
  symbol: string;
  price: string;
  change_24h: string;
  volume_24h: number;
  high_24h: string;
  low_24h: string;
  updated_at: string;
  premium_data?: {
    market_cap: number;
    circulating_supply: number;
    max_supply: number;
    all_time_high: string;
    all_time_high_date: string;
    price_prediction_24h: string;
  };
}

export default function Market() {
  const [publicData, setPublicData] = useState<MarketData[]>([]);
  const [premiumData, setPremiumData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [premiumError, setPremiumError] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [tab, setTab] = useState<"public" | "premium">("public");

  // Fetch public market data
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/market/public");

        if (response.status === 429) {
          const data = await response.json();
          console.log({ data });
          const retryAfter = parseInt(
            response.headers.get("Retry-After") || "5",
            10,
          );
          setError(
            `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
          );
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        // Display the rate limit headers for educational purposes
        const limit = response.headers.get("X-RateLimit-Limit");
        const remaining = response.headers.get("X-RateLimit-Remaining");
        const reset = response.headers.get("X-RateLimit-Reset");
        console.log(
          `Rate Limits - Limit: ${limit}, Remaining: ${remaining}, Reset: ${reset}`,
        );

        const data = await response.json();
        setPublicData(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchPublicData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch premium market data
  useEffect(() => {
    const fetchPremiumData = async () => {
      try {
        const response = await fetch("/api/market/premium");

        if (response.status === 401) {
          setPremiumError("Login required for premium data");
          return;
        }

        if (response.status === 403) {
          const data = await response.json();
          if (data.captchaRequired) {
            setShowCaptcha(true);
            setPremiumError(
              "Please complete the CAPTCHA to access premium data",
            );
          } else {
            setPremiumError("Access denied. Premium subscription required.");
          }
          return;
        }

        if (response.status === 429) {
          const retryAfter = parseInt(
            response.headers.get("Retry-After") || "5",
            10,
          );
          setPremiumError(
            `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
          );
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch premium data");
        }

        const data = await response.json();
        setPremiumData(data);
        setPremiumError(null);
      } catch (err) {
        setPremiumError((err as Error).message);
      }
    };

    if (tab === "premium") {
      fetchPremiumData();
    }
  }, [tab]);

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    // Reload premium data after CAPTCHA is completed
    if (tab === "premium") {
      setPremiumError(null);
      // Add a small delay to ensure the session is properly updated
      setTimeout(() => {
        fetch("/api/market/premium")
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error("Failed to fetch premium data");
          })
          .then((data) => {
            setPremiumData(data);
          })
          .catch((err) => {
            setPremiumError(err.message);
          });
      }, 500);
    }
  };

  function formatNumber(
    num: number,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  ) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(num);
  }

  function formatCurrency(value: string | number) {
    return `$${formatNumber(parseFloat(value.toString()))}`;
  }

  function formatLargeNumber(num: number) {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(3)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(3)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(3)}M`;
    return formatCurrency(num);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Market</h1>

      {/* Tab navigation */}
      <div className="flex border-b border-gray mb-6">
        <button
          className={`py-2 px-4 font-medium ${tab === "public" ? "border-b-2 border-primary text-primary" : "text-gray-dark"}`}
          onClick={() => setTab("public")}
        >
          Public Data
        </button>
        <button
          className={`py-2 px-4 font-medium ${tab === "premium" ? "border-b-2 border-primary text-primary" : "text-gray-dark"}`}
          onClick={() => setTab("premium")}
        >
          Premium Data
        </button>
      </div>

      {/* Public data tab */}
      {tab === "public" && (
        <>
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="card shimmer h-20"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>24h Change</th>
                    <th>24h Volume</th>
                    <th>24h High</th>
                    <th>24h Low</th>
                  </tr>
                </thead>
                <tbody>
                  {publicData.map((item) => (
                    <tr key={item.symbol}>
                      <td className="font-medium">{item.symbol}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td
                        className={
                          parseFloat(item.change_24h) >= 0
                            ? "crypto-up"
                            : "crypto-down"
                        }
                      >
                        {parseFloat(item.change_24h) >= 0 ? "+" : ""}
                        {item.change_24h}%
                      </td>
                      <td>{formatCurrency(item.volume_24h)}</td>
                      <td>{formatCurrency(item.high_24h)}</td>
                      <td>{formatCurrency(item.low_24h)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Public API Information</h3>
            <div className="card p-6">
              <p className="mb-4">
                This endpoint has the following rate limits and restrictions:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Rate limit: <code>20 requests per minute</code>
                </li>
                <li>Accessible without authentication</li>
                <li>Returns basic market data</li>
                <li>
                  Available at: <code>/api/market/public</code>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Premium data tab */}
      {tab === "premium" && (
        <>
          {premiumError && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-md mb-6">
              {premiumError}
              {premiumError.includes("Login required") && (
                <div className="mt-2">
                  <Link
                    href="/login"
                    className="button button-primary inline-block mt-2 text-sm"
                  >
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

          {!premiumError && premiumData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>24h Change</th>
                    <th>Market Cap</th>
                    <th>Circulating Supply</th>
                    <th>All-Time High</th>
                    <th>24h Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {premiumData.map((item) => (
                    <tr key={item.symbol}>
                      <td className="font-medium">{item.symbol}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td
                        className={
                          parseFloat(item.change_24h) >= 0
                            ? "crypto-up"
                            : "crypto-down"
                        }
                      >
                        {parseFloat(item.change_24h) >= 0 ? "+" : ""}
                        {item.change_24h}%
                      </td>
                      <td>
                        {item.premium_data
                          ? formatLargeNumber(item.premium_data.market_cap)
                          : "-"}
                      </td>
                      <td>
                        {item.premium_data
                          ? formatNumber(item.premium_data.circulating_supply)
                          : "-"}
                      </td>
                      <td>
                        {item.premium_data
                          ? formatCurrency(item.premium_data.all_time_high)
                          : "-"}
                      </td>
                      <td
                        className={
                          item.premium_data &&
                          parseFloat(item.premium_data.price_prediction_24h) >
                            parseFloat(item.price)
                            ? "crypto-up"
                            : "crypto-down"
                        }
                      >
                        {item.premium_data
                          ? formatCurrency(
                              item.premium_data.price_prediction_24h,
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !premiumError ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="card shimmer h-20"></div>
              ))}
            </div>
          ) : null}

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Premium API Information</h3>
            <div className="card p-6">
              <p className="mb-4">
                This endpoint has the following rate limits and restrictions:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Rate limit: <code>5 requests per minute</code>
                </li>
                <li>Requires authentication</li>
                <li>Requires premium access level</li>
                <li>May require CAPTCHA verification</li>
                <li>Returns enhanced market data with predictions</li>
                <li>
                  Available at: <code>/api/market/premium</code>
                </li>
              </ul>

              <p className="mt-4 text-sm text-gray-dark">
                Note: For the purpose of this demo, you can login with the
                premium account credentials mentioned on the login page.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
