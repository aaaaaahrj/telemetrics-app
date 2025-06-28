import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: this will _disable_ ESLint failures during `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
