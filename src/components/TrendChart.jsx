import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

function TrendChart({ testCases = [] }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    if (testCases.length === 0) return

    // Group test cases by date
    const groups = {}
    testCases.forEach(t => {
      const date = new Date(t.lastRun).toLocaleDateString("en-IN", {
        day: "2-digit", month: "2-digit"
      })
      if (!groups[date]) groups[date] = { passed: 0, failed: 0, skipped: 0 }
      if (t.status === "Passed") groups[date].passed++
      if (t.status === "Failed") groups[date].failed++
      if (t.status === "Skipped") groups[date].skipped++
    })

    // Sort dates chronologically
    const sortedDates = Object.keys(groups).sort((a, b) => {
      const [aDay, aMonth] = a.split("/").map(Number)
      const [bDay, bMonth] = b.split("/").map(Number)
      return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay
    })

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: sortedDates,
        datasets: [
          { label: "Passed", data: sortedDates.map(d => groups[d].passed), backgroundColor: "#22c55e", borderRadius: 3 },
          { label: "Failed", data: sortedDates.map(d => groups[d].failed), backgroundColor: "#ef4444", borderRadius: 3 },
          { label: "Skipped", data: sortedDates.map(d => groups[d].skipped), backgroundColor: "#f59e0b", borderRadius: 3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 12 }, boxWidth: 12, padding: 16 } },
        },
        scales: {
          x: { ticks: { font: { size: 11 } }, grid: { display: false } },
          y: { ticks: { font: { size: 11 } }, beginAtZero: true },
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [testCases])

  return (
   <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">
        Pass / fail trend timeline
      </p>
      <div style={{ position: "relative", height: "200px" }}>
        {testCases.length > 0 ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            No data to display.
          </div>
        )}
      </div>
    </div>
  )
}

export default TrendChart