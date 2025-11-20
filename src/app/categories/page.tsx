export default function CategoriesPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="text-sm text-gray-600">Default</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {['Food','Rent','Transportation','Utilities','Entertainment','Health'].map((c) => (
            <span key={c} className="px-2 py-1 rounded bg-gray-100">{c}</span>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="text-sm text-gray-600">Custom</h2>
        <form className="mt-3 flex gap-2">
          <input placeholder="New category" className="border rounded px-3 py-2" />
          <input placeholder="Color (e.g., #22c55e)" className="border rounded px-3 py-2" />
          <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Add</button>
        </form>
      </div>
    </section>
  )
}