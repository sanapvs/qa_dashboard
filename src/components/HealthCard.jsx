import { useEffect, useRef } from "react"

function calcScore(testCases) {
  if (!testCases.length) return 0
  const weights = { High: 3, Medium: 2, Low: 1 }
  let total = 0, passed = 0
  testCases.forEach(t => {
    const w = weights[t.priority] || 1
    total += w
    if (t.status === "Passed") passed += w
  })
  return Math.round((passed / total) * 100)
}

function HealthCard({ testCases }) {
  const ringRef = useRef(null)

  const passed = testCases.filter(t => t.status === "Passed").length
  const failed = testCases.filter(t => t.status === "Failed").length
  const skipped = testCases.filter(t => t.status === "Skipped").length
  const withDuration = testCases.filter(t => t.duration > 0)
  const avgDur = withDuration.length
    ? (withDuration.reduce((a, b) => a + b.duration, 0) / withDuration.length).toFixed(1)
    : "—"
  const score = calcScore(testCases)

  useEffect(() => {
    if (!ringRef.current) return
    const circ = 289
    const offset = circ - (score / 100) * circ
    ringRef.current.style.strokeDashoffset = offset
  }, [score])

  const verdict =
    score >= 80
      ? { text: "Healthy", cls: "bg-green-500/20 text-green-400" }
      : score >= 60
      ? { text: "Needs attention", cls: "bg-amber-500/20 text-amber-300" }
      : { text: "Critical", cls: "bg-red-500/20 text-red-400" }

  return (
    <div className="bg-slate-900 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 30% 20%, rgba(79,70,229,0.3) 0%, transparent 60%)" }}
      />

      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">
        Suite Health Score
      </p>

      {/* Ring */}
      <div className="relative w-28 h-28 mb-4">
        <svg viewBox="0 0 110 110" width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            ref={ringRef}
            cx="55" cy="55" r="46"
            fill="none" stroke="#4F46E5" strokeWidth="8" strokeLinecap="round"
            strokeDasharray="289" strokeDashoffset="289"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-medium text-white leading-none">{score}</span>
          <span className="text-xs text-slate-400 mt-1">/ 100</span>
        </div>
      </div>

      <span className={`text-xs font-medium px-3 py-1 rounded-full ${verdict.cls}`}>
        {verdict.text}
      </span>

      {/* Breakdown */}
      <div className="w-full mt-4 space-y-2">
        {[
          { label: "Passed", value: passed, color: "text-green-400" },
          { label: "Failed", value: failed, color: "text-red-400" },
          { label: "Skipped", value: skipped, color: "text-amber-300" },
          { label: "Avg duration", value: avgDur + "s", color: "text-slate-300" },
        ].map(row => (
          <div key={row.label} className="flex justify-between items-center">
            <span className="text-xs text-slate-500">{row.label}</span>
            <span className={`font-mono text-xs font-medium ${row.color}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HealthCard