/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Domains for next/image to allow external image loading
    domains: ["placehold.co", "jdowuzdumrucojkramsx.supabase.co"],

    // Optional: keep remotePatterns if you want pattern-based image loading
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
