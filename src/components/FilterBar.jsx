function FilterBar({ filters, setFilters, modules }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <input
        type="text"
        placeholder="Search by name or ID..."
        className="flex-1 min-w-48 text-sm px-3 py-2 rounded-lg text-slate-300 placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800 border border-slate-700"
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
      />
      {[
        { key: "status", options: ["All statuses", "Passed", "Failed", "Skipped"] },
        { key: "module", options: ["All modules", ...modules] },
        { key: "priority", options: ["All priorities", "High", "Medium", "Low"] },
      ].map(({ key, options }) => (
        <select
          key={key}
          className="text-sm px-3 py-2 rounded-lg text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800 border border-slate-700"
          value={filters[key]}
          onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
        >
           {options.map(o => <option key={o} className="bg-slate-800">{o}</option>)}
        </select>
      ))}
    </div>
  )
}

export default FilterBar