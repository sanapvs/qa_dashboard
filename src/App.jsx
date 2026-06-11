import { useState, useMemo } from "react"
import defaultData from "./data/qa-mock-data.json"
import Login from "./components/Login"
import FileUpload from "./components/FileUpload"
import HealthCard from "./components/HealthCard"
import StatCards from "./components/StatCards"
import TrendChart from "./components/TrendChart"
import PriorityPanel from "./components/PriorityPanel"
import ModulePanel from "./components/ModulePanel"
import FilterBar from "./components/FilterBar"
import TestTable from "./components/TestTable"

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("qa_user")
    return saved ? JSON.parse(saved) : null
  })

  const [testCases, setTestCases] = useState(defaultData.testCases)
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

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <div className="min-h-screen p-6" style={{ background: "#0F172A" }}>
      <div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900">QA Dashboard</h1>
              <p className="text-xs text-slate-400">Hapticware Intelligence · Last run: {lastRun}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5">
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user.email[0].toUpperCase()}
              </div>
              <span className="text-xs text-slate-600">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-full transition-colors bg-white"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* File upload */}
        <div className="mb-5">
          <FileUpload onDataLoaded={handleDataLoaded} />
        </div>

        {/* Health + Stats + Trend */}
        <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
          <HealthCard testCases={filtered} />
          <div className="flex flex-col gap-4">
            <StatCards testCases={filtered} />
            <TrendChart testCases={filtered} />
          </div>
        </div>

        {/* Priority + Module */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <PriorityPanel testCases={filtered} />
          <ModulePanel testCases={filtered} />
        </div>

        {/* Filters + Table */}
        <FilterBar filters={filters} setFilters={setFilters} modules={modules} />
        <TestTable testCases={filtered} />

      </div>
    </div>
  )
}

export default App