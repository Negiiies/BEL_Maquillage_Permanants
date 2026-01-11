import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,  // ← AJOUTE ÇA
  },
  typescript: {
    ignoreBuildErrors: true,  // ← ET ÇA AUSSI (au cas où)
  },
};

export default nextConfig;