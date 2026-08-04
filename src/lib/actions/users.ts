import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

const DEFAULT_USER_ID = 'user-default-001'

export async function getUsers() {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userId, DEFAULT_USER_ID))
    return result || []
  } catch (error) {
    console.error('[v0] Failed to fetch users:', error)
    return []
  }
}

export async function createUser(data: {
  name: string
  email: string
  status?: string
}) {
  try {
    const id = nanoid()
    const newUser = {
      id,
      userId: DEFAULT_USER_ID,
      name: data.name,
      email: data.email,
      status: data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert(users).values(newUser)
    return newUser
  } catch (error) {
    console.error('[v0] Failed to create user:', error)
    throw error
  }
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; status?: string }
) {
  try {
    await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(users.id, id), eq(users.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to update user:', error)
    throw error
  }
}

export async function deleteUser(id: string) {
  try {
    await db
      .delete(users)
      .where(and(eq(users.id, id), eq(users.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to delete user:', error)
    throw error
  }
}
