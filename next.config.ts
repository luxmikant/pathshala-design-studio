import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript - allow build to proceed with warnings
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimize for production
  poweredByHeader: false,
  reactStrictMode: true,
  
  // For serverless platforms like Vercel
  output: process.env.VERCEL ? undefined : "standalone",
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  
  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  // Webpack configuration for Windows compatibility
  webpack: (config, { isServer }) => {
    // Fix for Windows symlink issues
    config.resolve.symlinks = false;
    return config;
  },
  
  // Environment fallbacks for deployment
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000",
  },
};

export default nextConfig;
