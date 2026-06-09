import { useState, useMemo } from "react"
import defaultData from "./data/qa-mock-data.json"
import SummaryCards from "./components/SummaryCards"
import TrendChart from "./components/TrendChart"
import { aggregateTestData } from "./components/chartUtils"
import FilterBar from "./components/FilterBar"
import TestTable from "./components/TestTable"
import FileUpload from "./components/FileUpload"
import Login from "./components/Login"

function App() {
  const [user, setUser] = useState(() => {
    // Check localStorage for existing session on page load
    const saved = localStorage.getItem("qa_user")
    return saved ? JSON.parse(saved) : null
  })

  const [testCases, setTestCases] = useState(defaultData.testCases)
  const aggregatedData = aggregateTestData(testCases)
  const [filters, setFilters] = useState({
    search: "",
    status: "All statuses",
    module: "All modules",
    priority: "All priorities",
  })

  function handleLogin(userData) {
    localStorage.setItem("qa_user", JSON.stringify(userData))
    setUser(userData)
  }

  function handleLogout() {
    localStorage.removeItem("qa_user")
    setUser(null)
  }

  function handleDataLoaded(newCases) {
    setTestCases(newCases)
    setFilters({
      search: "",
      status: "All statuses",
      module: "All modules",
      priority: "All priorities",
    })
  }

  const lastRun = useMemo(() => {
    if (!testCases.length) return "N/A"
    const latest = testCases.reduce((a, b) =>
      new Date(a.lastRun) > new Date(b.lastRun) ? a : b
    )
    return new Date(latest.lastRun).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric"
    })
  }, [testCases])

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

  // Show login screen if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">

      {/* Header with logout */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">QA Dashboard</h1>
          <p className="text-sm text-gray-400">Hapticware Intelligence · Last run: {lastRun}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{user.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <FileUpload onDataLoaded={handleDataLoaded} />
      <SummaryCards testCases={filtered} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
      

      {/* 4. Stream transformed aggregated counts straight down to TrendChart */}
      <TrendChart trendRuns={aggregatedData} />
    </div>

      <FilterBar filters={filters} setFilters={setFilters} modules={modules} />
      <TestTable testCases={filtered} />
    </div>
  )
}

export default App