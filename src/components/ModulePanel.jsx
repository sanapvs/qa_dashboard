function ModulePanel({ testCases }) {
  const modules = [...new Set(testCases.map(t => t.module))].sort()

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-slate-600 mb-4">By module</p>
      <div className="space-y-3">
        {modules.map(m => {
          const group = testCases.filter(t => t.module === m)
          const pass = group.filter(t => t.status === "Passed").length
          const fail = group.filter(t => t.status === "Failed").length
          const skip = group.filter(t => t.status === "Skipped").length
          const total = group.length || 1
          const pp = Math.round((pass / total) * 100)
          const fp = Math.round((fail / total) * 100)
          const sp = 100 - pp - fp

          return (
            <div key={m} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-28 shrink-0 truncate" title={m}>{m}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-green-500" style={{ width: pp + "%" }} />
                <div className="bg-red-500" style={{ width: fp + "%" }} />
                <div className="bg-amber-400" style={{ width: sp + "%" }} />
              </div>
              <span className="font-mono text-xs text-slate-400 w-8 text-right">{pp}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ModulePanel