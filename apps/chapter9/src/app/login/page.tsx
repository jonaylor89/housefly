"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#282828] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            GraphQL Developer Hub
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#282828] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Sign In</h2>
          
          {error && (
            <div className="bg-[rgba(239,71,67,0.1)] border border-[#ef4743] text-[#ef4743] px-4 py-2 rounded mb-4 text-sm" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                placeholder="user@example.com"
              />
              <p className="mt-1 text-xs text-gray-500">Try: user@example.com / password123</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 py-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
      
      <footer className="bg-[#f3f4f5] dark:bg-[#282828] p-5 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300">GraphQL Developer Hub - A demo site for learning web scraping</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This is a simplified example with an in-memory GraphQL API</p>
        </div>
      </footer>
    </div>
  );
}