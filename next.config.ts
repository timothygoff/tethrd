import type { NextConfig } from "next";

const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "RESEND_API_KEY",
  "CRON_SECRET",
];

if (process.env.NODE_ENV !== "test" && !process.env.CI) {
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

const nextConfig: NextConfig = {};

export default nextConfig;
