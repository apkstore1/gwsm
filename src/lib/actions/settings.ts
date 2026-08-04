"use server";

import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function getUserId() {
  return "default-user";
}

export async function getSettings() {
  const userId = await getUserId();
  const userSettings = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, userId));

  if (userSettings.length === 0) {
    // Create default settings
    const id = nanoid();
    await db.insert(settings).values({
      id,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return db
      .select()
      .from(settings)
      .where(eq(settings.userId, userId));
  }

  return userSettings;
}

export async function updateSettings(data: Partial<typeof settings.$inferInsert>) {
  const userId = await getUserId();

  const existing = await db
    .select()
    .from(settings)
    .where(eq(settings.userId, userId));

  if (existing.length === 0) {
    const id = nanoid();
    await db.insert(settings).values({
      id,
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    await db
      .update(settings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(settings.userId, userId));
  }

  return getSettings();
}
