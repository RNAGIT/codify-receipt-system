/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper handling of environment variables
  env: {
    // These will be available at build time
    // Runtime env vars should be set in Vercel dashboard
  },
}

module.exports = nextConfig

