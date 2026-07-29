/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    // 백엔드 라우트 이름을 그대로 프록시한다 — 별도 프리픽스(/api 등)를 두지 않는 이유는
    // 백엔드가 refreshToken 쿠키의 Path를 "/auth/refresh-token"처럼 실제 라우트 경로로
    // 고정해두고 있어서, 브라우저에 보이는 경로도 백엔드 라우트와 동일해야 쿠키가 정상 전달된다.
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
