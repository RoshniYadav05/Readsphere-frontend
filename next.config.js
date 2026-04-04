/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ["placehold.co", "jdowuzdumrucojkramsx.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "jdowuzdumrucojkramsx.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;