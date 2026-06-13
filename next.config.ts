import type { NextConfig } from "next";


const nextConfig: NextConfig = {
<<<<<<< HEAD
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        pathname: '/uploads/**',
        hostname: 'localhost',
        port: '3001',

      },

=======
   images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**', 
      },
>>>>>>> main
    ],
  },
};

export default nextConfig;
