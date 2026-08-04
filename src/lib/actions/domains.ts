"use server";

import { db } from "@/lib/db";
import { domains } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function getUserId() {
  // For now, return a default user ID. In production, this would come from the session.
  return "default-user";
}

export async function getDomains() {
  const userId = await getUserId();
  return db
    .select()
    .from(domains)
    .where(eq(domains.userId, userId));
}

export async function createDomain(data: {
  name: string;
  mailboxCount: number;
  status?: string;
}) {
  const userId = await getUserId();
  const id = nanoid();

  await db.insert(domains).values({
    id,
    userId,
    name: data.name,
    mailboxCount: data.mailboxCount,
    status: data.status || "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id, ...data };
}

export async function updateDomain(id: string, data: Partial<typeof domains.$inferInsert>) {
  const userId = await getUserId();

  await db
    .update(domains)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(domains.id, id));

  return { id, ...data };
}

export async function deleteDomain(id: string) {
  const userId = await getUserId();
  await db
    .delete(domains)
    .where(eq(domains.id, id));
}
