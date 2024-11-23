/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables strict mode for highlighting potential issues in development
  swcMinify: true, // Ensures faster builds with smaller bundle sizes using SWC compiler

  // Adding domains for optimized images
  images: {
    domains: ['yourdomain.com', 'anotherdomain.com'], // Replace with domains you're loading images from
  },

  // Setting environment variables (ensure these are defined in your .env file)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Output standalone for serverless environments
  output: 'standalone',
};

export default nextConfig;
