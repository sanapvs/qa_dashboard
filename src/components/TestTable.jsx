const statusStyle = {
  Passed: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-700",
  Skipped: "bg-amber-100 text-amber-700",
}

const priorityStyle = {
  High: "text-red-600 font-medium",
  Medium: "text-amber-600",
  Low: "text-gray-400",
}

function TestTable({ testCases }) {
  if (!testCases.length) {
    return <p className="text-center text-gray-400 py-10 text-sm">No test cases match your filters.</p>
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            {["ID", "Test case", "Module", "Priority", "Status", "Time (s)"].map(h => (
              <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {testCases.map((t, i) => (
            <tr key={t.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
              <td className="px-4 py-3 font-mono text-xs text-gray-400">{t.id}</td>
              <td className="px-4 py-3 text-gray-800">{t.title}</td>
              <td className="px-4 py-3 text-gray-500">{t.module}</td>
              <td className={`px-4 py-3 ${priorityStyle[t.priority]}`}>{t.priority}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[t.status]}`}>
                  {t.status}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                {t.duration > 0 ? t.duration.toFixed(1) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TestTable