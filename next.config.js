/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper handling of environment variables
  env: {
    // These will be available at build time
    // Runtime env vars should be set in Vercel dashboard
  },
  // Fix for webpack chunk loading issues in dev mode
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Fix for dynamic chunk loading issues
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
      }
    }
    return config
  },
}

module.exports = nextConfig

