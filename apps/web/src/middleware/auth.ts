import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { mutSaPgDb } from "@/db/postgres";
import * as schema from "@/db/postgres/schema";

export const auth = betterAuth({
  database: drizzleAdapter(mutSaPgDb, { provider: "pg", schema }),
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Skip server-side token validation in dev to prevent ETIMEDOUT
      ...(process.env.NODE_ENV === "development" && {
        redirectURI: "http://localhost:3000/api/auth/callback/google",
        disablePkce: true,
      }),
    },
    apple: {
      // Completely disable Apple in dev to suppress warnings
      enabled: process.env.NODE_ENV === "production",
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,       // Update every 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,              // Cache for 5 minutes
    },
  },
  
  trustedOrigins: ["http://localhost:3000"],
});
