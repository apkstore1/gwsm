import { db } from '@/lib/db'
import { emailAccounts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

const DEFAULT_USER_ID = 'user-default-001'

export async function getEmailAccounts() {
  try {
    const result = await db
      .select()
      .from(emailAccounts)
      .where(eq(emailAccounts.userId, DEFAULT_USER_ID))
    return result || []
  } catch (error) {
    console.error('[v0] Failed to fetch email accounts:', error)
    return []
  }
}

export async function createEmailAccount(data: {
  address: string
  status?: string
}) {
  try {
    const id = nanoid()
    const newAccount = {
      id,
      userId: DEFAULT_USER_ID,
      address: data.address,
      status: data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert(emailAccounts).values(newAccount)
    return newAccount
  } catch (error) {
    console.error('[v0] Failed to create email account:', error)
    throw error
  }
}

export async function updateEmailAccount(
  id: string,
  data: { address?: string; status?: string }
) {
  try {
    await db
      .update(emailAccounts)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(emailAccounts.id, id), eq(emailAccounts.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to update email account:', error)
    throw error
  }
}

export async function deleteEmailAccount(id: string) {
  try {
    await db
      .delete(emailAccounts)
      .where(and(eq(emailAccounts.id, id), eq(emailAccounts.userId, DEFAULT_USER_ID)))
    return { success: true }
  } catch (error) {
    console.error('[v0] Failed to delete email account:', error)
    throw error
  }
}
