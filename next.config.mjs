/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*.googleusercontent.com",
        port: "",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
