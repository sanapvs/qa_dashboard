import { useState, useMemo } from "react"
import data from "./data/qa-mock-data.json"
import SummaryCards from "./components/SummaryCards"
import TrendChart from "./components/TrendChart"
import FilterBar from "./components/FilterBar"
import TestTable from "./components/TestTable"

const modules = [...new Set(data.testCases.map(t => t.module))].sort()

function App() {
  const [filters, setFilters] = useState({
    search: "",
    status: "All statuses",
    module: "All modules",
    priority: "All priorities",
  })

  const filtered = useMemo(() => {
    return data.testCases.filter(t => {
      const q = filters.search.toLowerCase()
      return (
        (!q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
        (filters.status === "All statuses" || t.status === filters.status) &&
        (filters.module === "All modules" || t.module === filters.module) &&
        (filters.priority === "All priorities" || t.priority === filters.priority)
      )
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">QA Dashboard</h1>
        <p className="text-sm text-gray-400">Hapticware Intelligence · Last run: 20 May 2026</p>
      </div>

      <SummaryCards testCases={filtered} />
      <TrendChart testRuns={data.testRuns} />
      <FilterBar filters={filters} setFilters={setFilters} modules={modules} />
      <TestTable testCases={filtered} />
    </div>
  )
}

export default App