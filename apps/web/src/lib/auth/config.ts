import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verificationCodes,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Handled by custom OTP
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: "http://localhost:3000/api/auth/callback/google",
      // Allow linking for seamless UX across methods
      allowAccountLinking: true, 
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || "",
      teamId: process.env.APPLE_TEAM_ID || "",
      keyId: process.env.APPLE_KEY_ID || "",
      privateKey: process.env.APPLE_PRIVATE_KEY || "",
      redirectURI: "http://localhost:3000/api/auth/callback/apple",
      disabled: !process.env.APPLE_CLIENT_ID, // Disable if no creds
    },
  },
  user: {
    additionalFields: {
      role: { 
        type: "string", 
        defaultValue: "student", 
        input: false 
      },
      regNo: { type: "string", required: false },
      emailVerified: { type: "boolean", defaultValue: false, input: false },
    },
  },
  advanced: {
    crossSubDomainCookies: { enabled: false },
    secureCookies: false,
    defaultCookieAttributes: { sameSite: "lax", path: "/" },
  },
});
