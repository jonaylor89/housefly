"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CaptchaVerify from "@/components/CaptchaVerify";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Show CAPTCHA verification before proceeding
    if (!captchaVerified) {
      setShowCaptcha(true);
      return;
    }

    setLoading(true);

    try {
      // This is a demo, so we'll just show a success message
      // In a real app, we would call an API endpoint here
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to login page with success message
      router.push("/login?signup=success");
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    setCaptchaVerified(true);
    // Auto-submit the form after CAPTCHA is verified
    setTimeout(() => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        router.push("/login?signup=success");
      }, 1500);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-gray-light p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <Image
            src="/favicon.svg"
            width={80}
            height={80}
            alt="CryptoDefend"
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-dark mt-2">
            Join CryptoDefend to start trading cryptocurrency
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {showCaptcha ? (
          <div>
            <h3 className="font-bold mb-4">Verify You&apos;re Human</h3>
            <CaptchaVerify onSuccess={handleCaptchaSuccess} />
            <button
              className="mt-4 text-primary text-sm hover:underline"
              onClick={() => setShowCaptcha(false)}
            >
              ← Back to form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-gray-dark mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input type="checkbox" id="terms" className="mr-2" required />
                <label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <div className="mb-6 bg-secondary/10 p-3 rounded-md text-sm">
              <p>
                <strong>Note:</strong> For security reasons, new accounts
                require CAPTCHA verification.
              </p>
            </div>

            <button
              type="submit"
              className="button button-primary w-full py-3"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
