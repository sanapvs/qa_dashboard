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

    // Group by date
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

    const sortedDates = Object.keys(groups).sort((a, b) => {
      const [aDay, aMonth] = a.split("/").map(Number)
      const [bDay, bMonth] = b.split("/").map(Number)
      return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay
    })

    const passed = sortedDates.map(d => groups[d].passed)
    const failed = sortedDates.map(d => groups[d].failed)
    const skipped = sortedDates.map(d => groups[d].skipped)

    // 7-day moving average of total runs per day
    const totals = sortedDates.map((_, i) => passed[i] + failed[i] + skipped[i])
    const movingAvg = totals.map((_, i) => {
      const start = Math.max(0, i - 6)
      const slice = totals.slice(start, i + 1)
      return Math.round((slice.reduce((a, b) => a + b, 0) / slice.length) * 10) / 10
    })

    chartRef.current = new Chart(canvasRef.current, {
      data: {
        labels: sortedDates,
        datasets: [
          { type: "bar", label: "Passed", data: passed, backgroundColor: "#22c55e", stack: "s" },
          { type: "bar", label: "Failed", data: failed, backgroundColor: "#ef4444", stack: "s" },
          { type: "bar", label: "Skipped", data: skipped, backgroundColor: "#f59e0b", stack: "s" },
          {
            type: "line",
            label: "7-day avg total",
            data: movingAvg,
            borderColor: "#6366f1",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { autoSkip: true, maxRotation: 0, font: { size: 10 }, color: "#94A3B8" },
            grid: { display: false },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { font: { size: 11 }, color: "#94A3B8" },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
        },
        interaction: { mode: "index", intersect: false },
      },
    })

    return () => chartRef.current?.destroy()
  }, [testCases])

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Daily test runs
        </p>
        <div className="flex gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" /> Passed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" /> Failed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500" /> Skipped</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-400 inline-block" /> 7-day avg</span>
        </div>
      </div>
      <div style={{ position: "relative", height: "220px" }}>
        {testCases.length > 0 ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-500 rounded-lg border border-dashed border-slate-700">
            No data to display.
          </div>
        )}
      </div>
    </div>
  )
}

export default TrendChart