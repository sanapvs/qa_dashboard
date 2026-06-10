function PriorityPanel({ testCases }) {
  const priorities = ["High", "Medium", "Low"]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-slate-600 mb-4">By priority</p>
      <div className="grid grid-cols-3 gap-3">
        {priorities.map(p => {
          const group = testCases.filter(t => t.priority === p)
          const pass = group.filter(t => t.status === "Passed").length
          const fail = group.filter(t => t.status === "Failed").length
          const skip = group.filter(t => t.status === "Skipped").length
          const total = group.length || 1
          const pp = Math.round((pass / total) * 100)
          const fp = Math.round((fail / total) * 100)
          const sp = 100 - pp - fp

          const labelColor = {
            High: "text-red-500",
            Medium: "text-amber-500",
            Low: "text-slate-400",
          }[p]

          return (
            <div key={p} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${labelColor}`}>{p}</p>
              <p className="font-mono text-xl font-medium text-slate-900 mb-2">{group.length}</p>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden flex mb-2">
                <div className="bg-green-500" style={{ width: pp + "%" }} />
                <div className="bg-red-500" style={{ width: fp + "%" }} />
                <div className="bg-amber-400" style={{ width: sp + "%" }} />
              </div>
              <div className="flex gap-2 text-xs text-slate-400">
                <span><span className="font-mono font-medium text-green-600">{pass}</span> pass</span>
                <span><span className="font-mono font-medium text-red-500">{fail}</span> fail</span>
                <span><span className="font-mono font-medium text-amber-500">{skip}</span> skip</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PriorityPanel