
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Temporary to prevent double mounting
  swcMinify: true,
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
