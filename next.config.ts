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
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RECEIVED_GMAIL: process.env.RECEIVED_GMAIL,
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DOCTOR_PHONE_NUMBER: process.env.DOCTOR_PHONE_NUMBER,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};

export default nextConfig;
