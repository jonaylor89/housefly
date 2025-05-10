"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Robots() {
  const [robotsTxt, setRobotsTxt] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRobotsTxt = async () => {
      try {
        setLoading(true);
        const response = await fetch("/robots.txt");
        const text = await response.text();
        setRobotsTxt(text);
      } catch (error) {
        console.error("Failed to fetch robots.txt", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRobotsTxt();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">robots.txt Guide</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Our robots.txt</h2>
            {loading ? (
              <div className="shimmer h-64 w-full rounded"></div>
            ) : (
              <pre className="bg-gray-light p-4 rounded-md overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                {robotsTxt}
              </pre>
            )}
          </div>

          <div className="mt-6">
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="button button-primary inline-flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              View Sitemap
            </Link>
          </div>
        </div>

        <div>
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Understanding robots.txt</h2>
            <p className="mb-4">
              The robots.txt file instructs web crawlers which parts of the site
              they can or cannot access. It&apos;s crucial for ethical web
              scraping to respect these directives.
            </p>

            <h3 className="font-bold mt-4 mb-2">Key Directives</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>User-agent:</strong> Specifies which crawler the rules
                apply to.
                <code>User-agent: *</code> applies to all crawlers.
              </li>
              <li>
                <strong>Disallow:</strong> Tells crawlers not to access
                specified paths.
              </li>
              <li>
                <strong>Allow:</strong> Explicitly permits crawling of specified
                paths (useful when they&apos;d otherwise be disallowed by a
                broader rule).
              </li>
              <li>
                <strong>Crawl-delay:</strong> Suggests a waiting time between
                requests (in seconds).
              </li>
              <li>
                <strong>Sitemap:</strong> Points to the website&apos;s sitemap
                file.
              </li>
            </ul>

            <h3 className="font-bold mt-6 mb-2">Hidden Tips</h3>
            <div className="bg-primary/5 p-4 rounded-md mb-4">
              <p>
                Sometimes robots.txt files contain special directives or hints
                for specific bots. These might be &quot;hidden&quot; in comments
                or in specific user-agent blocks.
              </p>
            </div>

            <h3 className="font-bold mt-4 mb-2">Ethical Scraping</h3>
            <p>
              Respecting robots.txt is a fundamental part of ethical web
              scraping. It represents the site owner&apos;s wishes about how
              their site should be crawled.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">
            Accessing Restricted Resources
          </h2>
          <p className="mb-4">
            Our site implements special access controls for robots that properly
            identify themselves and respect our robots.txt directives.
          </p>

          <div className="bg-secondary/10 p-4 rounded-md">
            <h3 className="font-bold mb-2">Secret Access Method</h3>
            <p className="mb-2">
              Bots that properly parse our robots.txt file may discover a
              special directive that allows access to restricted resources by
              setting a specific custom header to identify themselves as
              &quot;GoodBot&quot;.
            </p>
            <p className="font-mono text-sm">
              <code>X-Robots-Check: GoodBot</code>
            </p>
          </div>

          <div className="mt-6 text-sm text-gray-dark">
            <p>
              <strong>Note:</strong> This feature is designed for educational
              purposes, to teach the importance of properly parsing and
              respecting robots.txt directives. In real-world applications,
              various access control mechanisms may be employed, and respecting
              a site&apos;s specified access patterns is essential for ethical
              web scraping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
