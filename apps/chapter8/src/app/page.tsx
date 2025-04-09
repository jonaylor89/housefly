import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative h-96 mb-12 rounded-xl overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Beautiful travel destination"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl">
            Find and book your dream vacation with our easy-to-use travel platform
          </p>
          <Link 
            href="/search" 
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Searching
          </Link>
        </div>
      </section>

      {/* Login Form Teaser */}
      <section className="bg-blue-50 rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Sign In to Access Premium Features</h2>
            <p className="text-lg text-blue-800 mb-6">
              Create an account or log in to save your searches, access premium listings, and get personalized recommendations.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-white text-blue-600 border border-blue-600 px-5 py-2 rounded-md font-medium hover:bg-blue-50"
              >
                Create Account
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 bg-white rounded-lg p-6 shadow-md">
            <form className="space-y-4">
              <div>
                <label htmlFor="email-teaser" className="label">Email</label>
                <input 
                  id="email-teaser" 
                  type="email" 
                  className="input"
                  placeholder="Enter your email"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="password-teaser" className="label">Password</label>
                <input 
                  id="password-teaser" 
                  type="password" 
                  className="input"
                  placeholder="Enter your password"
                  disabled
                />
              </div>
              <p className="text-sm text-blue-600 text-center">
                Please <Link href="/login" className="underline">sign in</Link> to access these features
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Destinations */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Tropical Beach Resort", img: "/images/beach.jpg", premium: false },
            { name: "Mountain Getaway", img: "/images/mountain.jpg", premium: false },
            { name: "Luxury City Escape", img: "/images/city.jpg", premium: true },
          ].map((destination, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md bg-white">
              <div className="relative h-48">
                <Image 
                  src={destination.img}
                  alt={destination.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
                {destination.premium && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    PREMIUM
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                <p className="text-gray-600 mb-4">
                  Experience the beauty and wonder of this amazing destination.
                </p>
                <Link 
                  href={`/search?destination=${encodeURIComponent(destination.name)}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}