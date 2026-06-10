import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        pathname: '/uploads/**',
        hostname: 'localhost',
        port: '3001',

      },

    ],
  },
};

export default nextConfig;
