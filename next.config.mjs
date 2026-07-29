/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const backendPrefixes = [
      "auth",
      "users",
      "photo-cards",
      "market-postings",
      "exchange-proposals",
      "point-draws",
    ];
    return backendPrefixes.map((prefix) => ({
      source: `/${prefix}/:path*`,
      destination: `${process.env.BACKEND_ORIGIN}/${prefix}/:path*`,
    }));
  },
  logging: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
