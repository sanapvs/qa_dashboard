import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

// 1. Accept 'trendRuns' data array directly as a prop
function TrendChart({ trendRuns = [] }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    // 2. Clear canvas and destroy previous instances if incoming data is empty
    if (trendRuns.length === 0) {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
      return
    }

    // 3. Clean up active charts before rendering new ones to avoid overlaps
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // 4. Map the dynamic prop array values to the graph labels/data sets
    const labels = trendRuns.map((r) => (r.date ? r.date.slice(5) : "")) // turns '2026-06-09' -> '06-09'
    const passed = trendRuns.map((r) => r.passed)
    const failed = trendRuns.map((r) => r.failed)
    const skipped = trendRuns.map((r) => r.skipped)

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Passed", data: passed, backgroundColor: "#22c55e", borderRadius: 3 },
          { label: "Failed", data: failed, backgroundColor: "#ef4444", borderRadius: 3 },
          { label: "Skipped", data: skipped, backgroundColor: "#f59e0b", borderRadius: 3 },
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
  }, [trendRuns]) // 5. Redraw graph automatically whenever trendRuns data updates

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Pass / fail trend timeline
      </p>
      <div style={{ position: "relative", height: "200px" }}>
        {/* Render canvas when data is present, else show dynamic empty state */}
        {trendRuns.length > 0 ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            Please upload a valid data file above to view the trend metrics.
          </div>
        )}
      </div>
    </div>
  )
}

export default TrendChart