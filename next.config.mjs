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
};

export default nextConfig;
