"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Photo {
  id: number;
  title: string;
  url: string;
  photographer: string;
  likes: number;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const generateMockPhotos = (page: number) => {
    const startId = (page - 1) * 10;
    return Array.from({ length: 10 }, (_, i) => ({
      id: startId + i,
      title: `Photo ${startId + i}`,
      url: `https://picsum.photos/seed/${startId + i}/400/300`,
      photographer: `Photographer ${startId + i}`,
      likes: ((startId + i) * 7) % 1000,
    }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < 10) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [loading, page]);

  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setPhotos((prev) => [...prev, ...generateMockPhotos(page)]);
      setLoading(false);
    }, 1500);
  }, [page]);

  return (
    <main className="p-8">
      <h1 className="text-3xl mb-8">Infinite Photo Gallery</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <Image
              width={300}
              height={400}
              loading="lazy"
              src={photo.url}
              alt={photo.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl">{photo.title}</h2>
              <p>By {photo.photographer}</p>
              <div className="flex items-center">
                <span>❤️ {photo.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={loader} className="loader mt-8 text-center">
        {loading
          ? "Loading more photos..."
          : page >= 10
            ? "No more photos"
            : "Scroll for more"}
      </div>
    </main>
  );
}
