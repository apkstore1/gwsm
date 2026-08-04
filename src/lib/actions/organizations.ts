import { db } from '@/lib/db'
import { organizations } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

const DEFAULT_USER_ID = 'user-default-001'

export async function getOrganizations() {
  try {
    const result = await db
      .select()
      .from(organizations)
      .where(eq(organizations.userId, DEFAULT_USER_ID))
    return result || []
  } catch (error) {
    console.error('[v0] Failed to fetch organizations:', error)
    return []
  }
}

export async function createOrganization(data: {
  name: string
  email: string
  seats?: number
}) {
  try {
    const id = nanoid()
    const newOrg = {
      id,
      userId: DEFAULT_USER_ID,
      name: data.name,
      email: data.email,
      seats: data.seats || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert(organizations).values(newOrg)
    return newOrg
  } catch (error) {
    console.error('[v0] Failed to create organization:', error)
    throw error
  }
}

export async function updateOrganization(
  id: string,
  data: { name?: string; email?: string; seats?: number }
) {
  try {
    await db
      .update(organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(organizations.id, id), eq(organizations.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to update organization:', error)
    throw error
  }
}

export async function deleteOrganization(id: string) {
  try {
    await db
      .delete(organizations)
      .where(and(eq(organizations.id, id), eq(organizations.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to delete organization:', error)
    throw error
  }
}
