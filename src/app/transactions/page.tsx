'use client'
import { useEffect, useState } from 'react'
import { cacheGet, cacheSet, queueRequest, flushQueue } from '@/lib/cache'

type Transaction = {
  id: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  note?: string
  date: string
}

export default function TransactionsPage() {
  const [list, setList] = useState<Transaction[]>(cacheGet('txns', []))
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [note, setNote] = useState('')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    flushQueue()
  }, [])

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    setToken(t)
  }, [])

  async function load() {
    try {
      const res = await fetch('/api/transactions', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setList(data)
      cacheSet('txns', data)
    } catch (err) {
      // offline fallback already in state
    }
  }

  useEffect(() => {
    load()
  }, [token])

  async function addTxn() {
    const body = { amount: Number(amount), type, note }
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed')
      const created = await res.json()
      setList([created, ...list])
      cacheSet('txns', [created, ...list])
      setAmount('')
      setNote('')
    } catch {
      queueRequest({ url: '/api/transactions', method: 'POST', body })
      const temp: Transaction = {
        id: Math.random().toString(36).slice(2),
        amount: Number(amount),
        type,
        note,
        date: new Date().toISOString(),
      }
      setList([temp, ...list])
      cacheSet('txns', [temp, ...list])
      setAmount('')
      setNote('')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <div className="flex gap-2 items-end">
        <div>
          <label className="block text-sm">Amount</label>
          <input className="border p-2" value={amount} onChange={e=>setAmount(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Type</label>
          <select className="border p-2" value={type} onChange={e=>setType(e.target.value as any)}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm">Note</label>
          <input className="border p-2 w-full" value={note} onChange={e=>setNote(e.target.value)} />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addTxn}>Add</button>
      </div>
      <ul className="space-y-2">
        {list.map(t => (
          <li key={t.id} className="border p-2 flex justify-between">
            <span>{new Date(t.date).toLocaleDateString()} • {t.type}</span>
            <span className={t.type==='INCOME'?'text-green-700':'text-red-700'}>
              {t.type==='INCOME' ? '+' : '-'}${t.amount.toFixed?.(2) ?? t.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}