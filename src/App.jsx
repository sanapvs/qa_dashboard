import { useState, useMemo } from "react"
import defaultData from "./data/qa-mock-data.json"
import SummaryCards from "./components/SummaryCards"
import TrendChart from "./components/TrendChart"

import FilterBar from "./components/FilterBar"
import TestTable from "./components/TestTable"
import FileUpload from "./components/FileUpload"

const allModules = [...new Set(defaultData.testCases.map(t => t.module))].sort()

function App() {
  const [testCases, setTestCases] = useState(defaultData.testCases)
  const [filters, setFilters] = useState({
    search: "",
    status: "All statuses",
    module: "All modules",
    priority: "All priorities",
  })

  // When new data is uploaded, reset filters and load it in
  function handleDataLoaded(newCases) {
    setTestCases(newCases)
    setFilters({
      search: "",
      status: "All statuses",
      module: "All modules",
      priority: "All priorities",
    })
  }

  const modules = useMemo(
    () => [...new Set(testCases.map(t => t.module))].sort(),
    [testCases]
  )

  const filtered = useMemo(() => {
    return testCases.filter(t => {
      const q = filters.search.toLowerCase()
      return (
        (!q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
        (filters.status === "All statuses" || t.status === filters.status) &&
        (filters.module === "All modules" || t.module === filters.module) &&
        (filters.priority === "All priorities" || t.priority === filters.priority)
      )
    })
  }, [filters, testCases])
  
  const lastRun = useMemo(() => {
  if (!testCases.length) return "N/A"
  const latest = testCases.reduce((a, b) =>
    new Date(a.lastRun) > new Date(b.lastRun) ? a : b
  )
  return new Date(latest.lastRun).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  })
}, [testCases])

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">QA Dashboard</h1>
        <p className="text-sm text-gray-400">
  Hapticware Intelligence · Last run: {lastRun}
</p>
      </div>

      <FileUpload onDataLoaded={handleDataLoaded} />
      <SummaryCards testCases={filtered} />

      
        <TrendChart />
      

      <FilterBar filters={filters} setFilters={setFilters} modules={modules} />
      <TestTable testCases={filtered} />
    </div>
  )
}

export default App