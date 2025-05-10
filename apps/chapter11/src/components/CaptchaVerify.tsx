"use client";

import { useState, useEffect } from "react";

interface CaptchaVerifyProps {
  onSuccess: () => void;
}

export default function CaptchaVerify({ onSuccess }: CaptchaVerifyProps) {
  const [problem, setProblem] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [solution, setSolution] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load CAPTCHA on component mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/captcha/generate");

      if (!response.ok) {
        throw new Error("Failed to load CAPTCHA");
      }

      const data = await response.json();
      setProblem(data.problem);
      setToken(data.token);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution || !token) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch("/api/captcha/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          solution,
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        console.log({ data });
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "5",
          10,
        );
        throw new Error(
          `Too many attempts. Please try again in ${retryAfter} seconds.`,
        );
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Verification failed");
      }

      // CAPTCHA verification successful
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
      // Reload CAPTCHA if verification failed
      fetchCaptcha();
    } finally {
      setSubmitting(false);
      setSolution("");
    }
  };

  return (
    <div className="captcha-container">
      <h3 className="text-lg font-bold mb-4">Human Verification Required</h3>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="shimmer h-12 w-full rounded mb-4"></div>
      ) : (
        <div className="mb-4">
          <div className="bg-primary/5 p-4 rounded-md flex items-center justify-center mb-3">
            <div className="text-xl font-mono font-bold">{problem} = ?</div>
          </div>
          <p className="text-sm text-gray-dark">
            Please solve this simple math problem to verify you are human.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="input flex-1"
          placeholder="Enter your answer"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          disabled={loading || submitting}
          required
        />
        <button
          type="submit"
          className="button button-primary whitespace-nowrap"
          disabled={loading || submitting || !solution}
        >
          {submitting ? "Verifying..." : "Verify"}
        </button>
        <button
          type="button"
          className="button button-ghost"
          onClick={fetchCaptcha}
          disabled={loading || submitting}
        >
          Refresh
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-dark">
        <strong>Note:</strong> This simplified CAPTCHA uses math problems for
        educational purposes. Real-world systems would use more sophisticated
        verification methods.
      </div>
    </div>
  );
}
