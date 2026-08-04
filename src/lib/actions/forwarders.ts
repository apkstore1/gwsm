import { db } from '@/lib/db'
import { forwarders } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

const DEFAULT_USER_ID = 'user-default-001'

export async function getForwarders() {
  try {
    const result = await db
      .select()
      .from(forwarders)
      .where(eq(forwarders.userId, DEFAULT_USER_ID))
    return result || []
  } catch (error) {
    console.error('[v0] Failed to fetch forwarders:', error)
    return []
  }
}

export async function createForwarder(data: {
  address: string
  destination: string
}) {
  try {
    const id = nanoid()
    const newForwarder = {
      id,
      userId: DEFAULT_USER_ID,
      address: data.address,
      destination: data.destination,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert(forwarders).values(newForwarder)
    return newForwarder
  } catch (error) {
    console.error('[v0] Failed to create forwarder:', error)
    throw error
  }
}

export async function updateForwarder(
  id: string,
  data: { address?: string; destination?: string }
) {
  try {
    await db
      .update(forwarders)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(forwarders.id, id), eq(forwarders.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to update forwarder:', error)
    throw error
  }
}

export async function deleteForwarder(id: string) {
  try {
    await db
      .delete(forwarders)
      .where(and(eq(forwarders.id, id), eq(forwarders.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to delete forwarder:', error)
    throw error
  }
}
