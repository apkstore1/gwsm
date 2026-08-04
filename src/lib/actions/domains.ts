import { db } from '@/lib/db'
import { domains } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

const DEFAULT_USER_ID = 'user-default-001'

export async function getDomains() {
  try {
    const result = await db
      .select()
      .from(domains)
      .where(eq(domains.userId, DEFAULT_USER_ID))
    return result || []
  } catch (error) {
    console.error('[v0] Failed to fetch domains:', error)
    return []
  }
}

export async function createDomain(data: {
  name: string
  status: string
  mailboxCount?: number
}) {
  try {
    const id = nanoid()
    const newDomain = {
      id,
      userId: DEFAULT_USER_ID,
      name: data.name,
      status: data.status,
      mailboxCount: data.mailboxCount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert(domains).values(newDomain)
    return newDomain
  } catch (error) {
    console.error('[v0] Failed to create domain:', error)
    throw error
  }
}

export async function updateDomain(
  id: string,
  data: { name?: string; status?: string; mailboxCount?: number }
) {
  try {
    await db
      .update(domains)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(domains.id, id), eq(domains.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to update domain:', error)
    throw error
  }
}

export async function deleteDomain(id: string) {
  try {
    await db
      .delete(domains)
      .where(and(eq(domains.id, id), eq(domains.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to delete domain:', error)
    throw error
  }
}
