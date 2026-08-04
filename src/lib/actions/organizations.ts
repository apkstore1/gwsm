"use server";

import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function getUserId() {
  return "default-user";
}

export async function getOrganizations() {
  const userId = await getUserId();
  return db
    .select()
    .from(organizations)
    .where(eq(organizations.userId, userId));
}

export async function createOrganization(data: {
  name: string;
  email: string;
  seats?: number;
}) {
  const userId = await getUserId();
  const id = nanoid();

  await db.insert(organizations).values({
    id,
    userId,
    name: data.name,
    email: data.email,
    seats: data.seats || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id, ...data };
}

export async function updateOrganization(
  id: string,
  data: Partial<typeof organizations.$inferInsert>
) {
  const userId = await getUserId();

  await db
    .update(organizations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(organizations.id, id));

  return { id, ...data };
}

export async function deleteOrganization(id: string) {
  const userId = await getUserId();
  await db
    .delete(organizations)
    .where(eq(organizations.id, id));
}
