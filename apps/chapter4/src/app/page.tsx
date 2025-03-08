"use client";

import { getNewsFeed, NewsItem } from "@/data/feed";
import { useState, useEffect } from "react";

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate API dela
    setTimeout(() => {
      const items = getNewsFeed();
      setNews(items);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl mb-8">Dynamic News Feed</h1>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="news-container">
          {news.map((item) => (
            <article key={item.id} className="news-item mb-4 p-4 border">
              <h2 className="text-xl">{item.title}</h2>
              <p>{item.content}</p>
              <div className="meta text-sm text-gray-600">
                <span>By {item.author}</span>
                <time dateTime={item.timestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </time>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
