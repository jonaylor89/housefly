"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Include CSRF token handling
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();
      
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        csrfToken,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Login failed");
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In to Your Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="csrfToken" />
          
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full mt-6"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}