function TrendChart({ testRuns }) {
  const max = Math.max(...testRuns.map(r => r.passed + r.failed))

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Pass / fail trend — last 7 days
      </p>
      <div className="flex items-end gap-2 h-20">
        {testRuns.map(run => (
          <div key={run.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: "64px" }}>
              <div
                className="w-3 bg-green-500 rounded-t"
                style={{ height: `${(run.passed / max) * 64}px` }}
                title={`Passed: ${run.passed}`}
              />
              <div
                className="w-3 bg-red-400 rounded-t"
                style={{ height: `${(run.failed / max) * 64}px` }}
                title={`Failed: ${run.failed}`}
              />
            </div>
            <span className="text-xs text-gray-400">{run.date.slice(5)}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500" /> Passed
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-red-400" /> Failed
        </div>
      </div>
    </div>
  )
}

export default TrendChart