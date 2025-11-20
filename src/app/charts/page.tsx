'use client'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Transaction = { amount: number; type: 'INCOME'|'EXPENSE'; date: string }

export default function ChartsPage() {
  const [data, setData] = useState<Transaction[]>([])
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    setToken(t)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/transactions', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Failed')
        const items = await res.json()
        setData(items)
      } catch { /* silent */ }
    }
    load()
  }, [token])

  const monthly = new Map<string, { income: number; expense: number }>()
  for (const t of data) {
    const k = new Date(t.date).toISOString().slice(0,7)
    const v = monthly.get(k) || { income: 0, expense: 0 }
    if (t.type === 'INCOME') v.income += t.amount
    else v.expense += t.amount
    monthly.set(k, v)
  }
  const labels = Array.from(monthly.keys()).sort()
  const chartData = {
    labels,
    datasets: [
      { label: 'Income', data: labels.map(l=>monthly.get(l)?.income||0), backgroundColor: 'rgba(16,185,129,0.6)' },
      { label: 'Expense', data: labels.map(l=>monthly.get(l)?.expense||0), backgroundColor: 'rgba(239,68,68,0.6)' },
    ],
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Charts</h1>
      <p className="text-gray-600">Compare monthly income and expenses at a glance.</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Bar data={chartData} />
      </div>
    </div>
  )
}