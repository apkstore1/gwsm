import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.VITE_NEON_AUTH_URL || "/api/auth",
});
