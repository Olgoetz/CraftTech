// lib/auth.ts

import { auth } from "@/auth";

/**
 * Retrieves the authenticated user's ID from the session.
 *
 * @returns The user's ID as a string.
 * @throws If no user is authenticated.
 */
export const getAuthenticatedUserId = async (): Promise<string> => {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }
  return session.user?.id as string;
};

export const getRole = async (): Promise<string> => {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }
  return session.user?.role as string;
};
