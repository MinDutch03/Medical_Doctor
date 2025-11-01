import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/dashboard", destination: "/pages/dashboard" },
      { source: "/dashboard/medical-agent/:sessionId", destination: "/pages/dashboard/medical-agent/:sessionId" },
      { source: "/about-us", destination: "/pages/about-us" },
      { source: "/contact-us", destination: "/pages/contact-us" },
      { source: "/sign-in", destination: "/auth/sign-in" },
      { source: "/sign-up", destination: "/auth/sign-up" },
    ];
  },
};

export default nextConfig;
