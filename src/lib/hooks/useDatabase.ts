'use client'

import { useState, useEffect, useCallback } from 'react'
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '@/lib/actions/organizations'
import { getDomains, createDomain, updateDomain, deleteDomain } from '@/lib/actions/domains'
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/actions/users'
import { getEmailAccounts, createEmailAccount, updateEmailAccount, deleteEmailAccount } from '@/lib/actions/email-accounts'
import { getForwarders, createForwarder, updateForwarder, deleteForwarder } from '@/lib/actions/forwarders'

export function useOrganizations() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getOrganizations()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const create = useCallback(async (org: { name: string; email: string; seats?: number }) => {
    const newOrg = await createOrganization(org)
    setData((prev) => [newOrg, ...prev])
    return newOrg
  }, [])

  const update = useCallback(async (id: string, org: any) => {
    await updateOrganization(id, org)
    setData((prev) => prev.map((o) => (o.id === id ? { ...o, ...org } : o)))
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteOrganization(id)
    setData((prev) => prev.filter((o) => o.id !== id))
  }, [])

  return { data, loading, error, create, update, remove }
}

export function useDomains() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getDomains()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const create = useCallback(async (domain: { name: string; status: string; mailboxCount?: number }) => {
    const newDomain = await createDomain(domain)
    setData((prev) => [newDomain, ...prev])
    return newDomain
  }, [])

  const update = useCallback(async (id: string, domain: any) => {
    await updateDomain(id, domain)
    setData((prev) => prev.map((d) => (d.id === id ? { ...d, ...domain } : d)))
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteDomain(id)
    setData((prev) => prev.filter((d) => d.id !== id))
  }, [])

  return { data, loading, error, create, update, remove }
}

export function useUsers() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getUsers()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const create = useCallback(async (user: { name: string; email: string; status?: string }) => {
    const newUser = await createUser(user)
    setData((prev) => [newUser, ...prev])
    return newUser
  }, [])

  const update = useCallback(async (id: string, user: any) => {
    await updateUser(id, user)
    setData((prev) => prev.map((u) => (u.id === id ? { ...u, ...user } : u)))
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteUser(id)
    setData((prev) => prev.filter((u) => u.id !== id))
  }, [])

  return { data, loading, error, create, update, remove }
}

export function useEmailAccounts() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getEmailAccounts()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const create = useCallback(async (account: { address: string; status?: string }) => {
    const newAccount = await createEmailAccount(account)
    setData((prev) => [newAccount, ...prev])
    return newAccount
  }, [])

  const update = useCallback(async (id: string, account: any) => {
    await updateEmailAccount(id, account)
    setData((prev) => prev.map((a) => (a.id === id ? { ...a, ...account } : a)))
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteEmailAccount(id)
    setData((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return { data, loading, error, create, update, remove }
}

export function useForwarders() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getForwarders()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const create = useCallback(async (forwarder: { address: string; destination: string }) => {
    const newForwarder = await createForwarder(forwarder)
    setData((prev) => [newForwarder, ...prev])
    return newForwarder
  }, [])

  const update = useCallback(async (id: string, forwarder: any) => {
    await updateForwarder(id, forwarder)
    setData((prev) => prev.map((f) => (f.id === id ? { ...f, ...forwarder } : f)))
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteForwarder(id)
    setData((prev) => prev.filter((f) => f.id !== id))
  }, [])

  return { data, loading, error, create, update, remove }
}
