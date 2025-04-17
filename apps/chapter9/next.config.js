// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Add problematic directories to exclusions
    config.watchOptions = {
      ignored: ["**/node_modules", "**/.git", "**/.next"],
    };
    return config;
  },
};

export default nextConfig;
