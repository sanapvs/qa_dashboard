import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

function StatusDonut({ testCases = [] }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  const total = testCases.length
  const passed = testCases.filter(t => t.status === "Passed").length
  const failed = testCases.filter(t => t.status === "Failed").length
  const skipped = testCases.filter(t => t.status === "Skipped").length

  const pct = n => total ? Math.round((n / total) * 100) : 0

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    if (total === 0) return

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Passed", "Failed", "Skipped"],
        datasets: [{
          data: [passed, failed, skipped],
          backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: { legend: { display: false } },
      },
    })

    return () => chartRef.current?.destroy()
  }, [testCases])

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
        Overall split
      </p>
      <div style={{ position: "relative", height: "150px" }}>
        {total > 0 ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-500 rounded-lg border border-dashed border-slate-700">
            No data
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 mt-3 text-xs">
        <div className="flex justify-between">
          <span className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-sm bg-green-500" /> Passed
          </span>
          <span className="font-mono font-medium text-slate-200">{pct(passed)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-sm bg-red-500" /> Failed
          </span>
          <span className="font-mono font-medium text-slate-200">{pct(failed)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-sm bg-amber-500" /> Skipped
          </span>
          <span className="font-mono font-medium text-slate-200">{pct(skipped)}%</span>
        </div>
        <div className="flex justify-between border-t border-slate-700 mt-1 pt-1.5">
          <span className="text-slate-500">Total runs</span>
          <span className="font-mono font-medium text-slate-200">{total}</span>
        </div>
      </div>
    </div>
  )
}

export default StatusDonut