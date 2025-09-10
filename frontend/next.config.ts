import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 暫時禁用 API 代理來排除後端連接問題
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/:path*` : 'http://localhost:3001/api/:path*'
  //     }
  //   ];
  // }
};

export default nextConfig;
