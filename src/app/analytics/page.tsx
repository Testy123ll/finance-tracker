"use client"
import { useEffect, useState } from "react"
import { Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type Transaction = { amount: number; type: 'INCOME'|'EXPENSE'; date: string; note?: string; category?: string }

export default function AnalyticsPage() {
  const [token, setToken] = useState<string | null>(null)
  const [data, setData] = useState<Transaction[]>([])

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

  const byCategory = new Map<string, number>()
  for (const t of data) {
    const cat = t.category || (t.type === 'INCOME' ? 'Income' : 'Expense')
    byCategory.set(cat, (byCategory.get(cat) || 0) + t.amount)
  }
  const categoryLabels = Array.from(byCategory.keys())
  const categoryValues = categoryLabels.map(l => byCategory.get(l) || 0)

  const pieData = {
    labels: categoryLabels,
    datasets: [{
      label: 'Totals',
      data: categoryValues,
      backgroundColor: [
        'rgba(59,130,246,0.6)',
        'rgba(16,185,129,0.6)',
        'rgba(234,179,8,0.6)',
        'rgba(239,68,68,0.6)',
        'rgba(99,102,241,0.6)',
        'rgba(168,85,247,0.6)'
      ],
      borderWidth: 0,
    }]
  }

  const monthly = new Map<string, { income: number; expense: number }>()
  for (const t of data) {
    const k = new Date(t.date).toISOString().slice(0,7)
    const v = monthly.get(k) || { income: 0, expense: 0 }
    if (t.type === 'INCOME') v.income += t.amount
    else v.expense += t.amount
    monthly.set(k, v)
  }
  const labels = Array.from(monthly.keys()).sort()
  const lineData = {
    labels,
    datasets: [
      { label: 'Income', data: labels.map(l=>monthly.get(l)?.income||0), borderColor: 'rgba(16,185,129,1)', backgroundColor: 'rgba(16,185,129,0.2)', tension: 0.3 },
      { label: 'Expense', data: labels.map(l=>monthly.get(l)?.expense||0), borderColor: 'rgba(239,68,68,1)', backgroundColor: 'rgba(239,68,68,0.2)', tension: 0.3 },
    ],
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="text-gray-600">Visualize your spending and income across categories and time.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-700">Category Breakdown</h2>
            <span className="text-xs text-gray-500">Pie</span>
          </div>
          <Pie data={pieData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-700">Trends Over Time</h2>
            <span className="text-xs text-gray-500">Line</span>
          </div>
          <Line data={lineData} />
        </div>
      </div>
    </section>
  )
}