"use server";

import { db } from "@/lib/db";
import {
  organizations,
  domains,
  emailAccounts,
  forwarders,
  users,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function getUserId() {
  return "default-user";
}

export async function seedDatabase() {
  const userId = await getUserId();

  // Check if already seeded
  const existingOrgs = await db
    .select()
    .from(organizations)
    .where(eq(organizations.userId, userId));

  if (existingOrgs.length > 0) {
    return { message: "Database already seeded" };
  }

  // Seed organizations
  const seedOrganizations = [
    { name: "Acme Corp", email: "admin@acme.com", seats: 45 },
    { name: "TechStart Labs", email: "hello@techstart.io", seats: 32 },
    { name: "Innovation Hub", email: "team@innovation.hub", seats: 79 },
  ];

  const orgIds: string[] = [];
  for (const org of seedOrganizations) {
    const id = nanoid();
    await db.insert(organizations).values({
      id,
      userId,
      name: org.name,
      email: org.email,
      seats: org.seats,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    orgIds.push(id);
  }

  // Seed domains
  const seedDomains = [
    { name: "mail.acme.com", mailboxCount: 15, status: "Verified" },
    { name: "mail.techstart.io", mailboxCount: 8, status: "Verified" },
    { name: "mail.innovation.hub", mailboxCount: 42, status: "Pending MX" },
    { name: "backup.acme.com", mailboxCount: 5, status: "Verified" },
  ];

  for (const domain of seedDomains) {
    const id = nanoid();
    await db.insert(domains).values({
      id,
      userId,
      name: domain.name,
      mailboxCount: domain.mailboxCount,
      status: domain.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Seed email accounts
  const seedAccounts = [
    { address: "admin@mail.acme.com" },
    { address: "support@mail.acme.com" },
    { address: "hello@mail.techstart.io" },
    { address: "team@mail.innovation.hub" },
  ];

  for (const account of seedAccounts) {
    const id = nanoid();
    await db.insert(emailAccounts).values({
      id,
      userId,
      address: account.address,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Seed forwarders
  const seedForwarders = [
    { address: "hello@acme.com", destination: "admin@mail.acme.com" },
    { address: "contact@techstart.io", destination: "hello@mail.techstart.io" },
  ];

  for (const forwarder of seedForwarders) {
    const id = nanoid();
    await db.insert(forwarders).values({
      id,
      userId,
      address: forwarder.address,
      destination: forwarder.destination,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Seed users
  const seedUsers = [
    { name: "Alice Johnson", email: "alice@acme.com" },
    { name: "Bob Smith", email: "bob@techstart.io" },
    { name: "Carol Davis", email: "carol@innovation.hub" },
  ];

  for (const user of seedUsers) {
    const id = nanoid();
    await db.insert(users).values({
      id,
      userId,
      name: user.name,
      email: user.email,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return { message: "Database seeded successfully" };
}
