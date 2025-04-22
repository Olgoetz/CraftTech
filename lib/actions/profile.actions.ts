"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { profiles, users } from "@/database/schema";
import { ProfileProps } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateName = async (name: string) => {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }

  await db
    .update(users)
    .set({ name })
    .where(eq(users.id, session.user?.id as string));
  revalidatePath("/mein-profil");
};

export const getProfile = async (userId: string) => {
  const contactData = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  return contactData[0];
};

export const upsertProfile = async ({
  user,
  street,
  zipCode,
  city,
  phone,
}: ProfileProps) => {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }

  await db
    .insert(profiles)
    .values({
      userId: user.id as string,
      street,
      zipCode,
      city,
      phone,
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        street,
        zipCode,
        city,
        phone,
      },
    });
  revalidatePath("/mein-profil");
};
