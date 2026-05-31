import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import data from "../data/qa-mock-data.json"

Chart.register(...registerables)

function TrendChart() {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const labels = data.testRuns.map(r => r.date.slice(5))
    const passed = data.testRuns.map(r => r.passed)
    const failed = data.testRuns.map(r => r.failed)
    const skipped = data.testRuns.map(r => r.skipped ?? 0)

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
  }, [])

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Pass / fail trend — last 7 days
      </p>
      <div style={{ position: "relative", height: "200px" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default TrendChart