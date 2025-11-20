export default function BudgetsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Budgets</h1>
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="text-sm text-gray-600">Set Budget</h2>
        <form className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input placeholder="Category" className="border rounded px-3 py-2" />
          <select className="border rounded px-3 py-2">
            <option>Monthly</option>
            <option>Weekly</option>
          </select>
          <input placeholder="Amount" type="number" className="border rounded px-3 py-2" />
          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Save</button>
        </form>
      </div>
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="text-sm text-gray-600">Budget Performance</h2>
        <p className="mt-2 text-sm text-gray-700">Charts coming soon.</p>
      </div>
    </section>
  )
}