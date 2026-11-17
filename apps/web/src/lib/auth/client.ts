import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// Export individual methods for direct imports
export const { signIn, signUp, signOut, useSession } = authClient;
