import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Secure Crypto Trading Platform</h1>
              <p className="text-lg mb-8">Experience the most advanced and secure cryptocurrency exchange with best-in-class protection for your digital assets.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/trading" className="button button-secondary">Start Trading</Link>
                <Link href="/signup" className="button button-ghost border-white">Create Account</Link>
              </div>
            </div>
            <div className="relative h-[400px] flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary opacity-10 rounded-full animate-pulse"></div>
              <div className="relative z-10">
                <Image
                  src="/favicon.svg"
                  width={200}
                  height={200}
                  alt="CryptoDefend"
                  className="drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market trends section with live data */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Market Trends</h2>
          <p className="text-center text-gray-dark mb-12 max-w-2xl mx-auto">
            Stay updated with real-time cryptocurrency prices and market movements.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* These cards will be populated with actual data in production */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">BTC/USD</h3>
                <span className="crypto-up">+2.34%</span>
              </div>
              <div className="text-2xl font-bold mb-2">$39,245.67</div>
              <div className="text-sm text-gray-dark">Vol: $1.2B (24h)</div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">ETH/USD</h3>
                <span className="crypto-down">-0.87%</span>
              </div>
              <div className="text-2xl font-bold mb-2">$2,105.42</div>
              <div className="text-sm text-gray-dark">Vol: $845M (24h)</div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">SOL/USD</h3>
                <span className="crypto-up">+5.12%</span>
              </div>
              <div className="text-2xl font-bold mb-2">$89.73</div>
              <div className="text-sm text-gray-dark">Vol: $324M (24h)</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/market" className="button button-primary">View All Markets</Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-gray-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Advanced Security Features</h2>
          <p className="text-center text-gray-dark mb-12 max-w-2xl mx-auto">
            CryptoDefend implements multiple layers of security to protect your assets and data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Layer Security</h3>
              <p className="text-gray-dark">
                Advanced protection mechanisms including 2FA, biometric verification, and cold storage for funds.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5M9.75 17.25v1.5m12-1.5v1.5m-12-1.5v1.5m-12-1.5v1.5M6 16.5h.75m6 1.5v-1.5m-6 0v-1.5m12 0v-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
              <p className="text-gray-dark">
                24/7 transaction monitoring with advanced fraud detection algorithms.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Insurance Protection</h3>
              <p className="text-gray-dark">
                User funds are covered by our comprehensive insurance policy against cyber threats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start trading securely?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust CryptoDefend for secure and efficient cryptocurrency trading.
          </p>
          <Link href="/signup" className="button button-secondary">Create Account</Link>
        </div>
      </section>
    </div>
  );
}
