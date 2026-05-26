function FilterBar({ filters, setFilters, modules }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <input
        type="text"
        placeholder="Search by name or ID..."
        className="border border-gray-200 rounded-md px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-1 focus:ring-gray-400"
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
          className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={filters[key]}
          onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ))}
    </div>
  )
}

export default FilterBar