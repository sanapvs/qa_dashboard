import { useState, useEffect } from "react"

const statusStyle = {
  Passed: "bg-green-500/20 text-green-400",
  Failed: "bg-red-500/20 text-red-400",
  Skipped: "bg-amber-500/20 text-amber-300",
}
const priorityStyle = {
  High: "text-red-400 font-medium",
  Medium: "text-amber-400",
  Low: "text-slate-500",
}

function DetailPanel({ test, onClose }) {
  if (!test) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="bg-slate-900 border-l border-slate-700 w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-xs text-slate-500 mb-1">{test.id}</p>
            <p className="font-semibold text-white text-base leading-snug">{test.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xl leading-none ml-4 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1 text-sm">
          <Row label="Status">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[test.status]}`}>
              {test.status}
            </span>
          </Row>
          <Row label="Module"><span className="text-slate-300">{test.module}</span></Row>
          <Row label="Priority"><span className={priorityStyle[test.priority]}>{test.priority}</span></Row>
          <Row label="Duration">
            <span className="font-mono text-slate-400">
              {test.duration > 0 ? `${test.duration.toFixed(1)}s` : "—"}
            </span>
          </Row>
          <Row label="Last run">
            <span className="text-slate-400 text-xs">
              {new Date(test.lastRun).toLocaleString("en-IN", {
                dateStyle: "medium", timeStyle: "short"
              })}
            </span>
          </Row>

          {test.tags?.length > 0 && (
            <div className="pt-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {test.tags.map(tag => (
                  <span key={tag} className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {test.errorMessage && (
            <div className="pt-3">
              <p className="text-xs font-medium text-red-400 uppercase tracking-wide mb-2">Error message</p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 font-mono text-xs text-red-400 leading-relaxed">
                {test.errorMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide w-24 shrink-0">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  )
}

const PAGE_SIZE = 10

function TestTable({ testCases }) {
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [testCases])

  const totalPages = Math.ceil(testCases.length / PAGE_SIZE)
  const paginated = testCases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (!testCases.length) {
    return (
      <p className="text-center text-slate-500 py-10 text-sm">
        No test cases match your filters.
      </p>
    )
  }

  return (
    <>
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-700">
              {["ID", "Test case", "Module", "Priority", "Status", "Time (s)"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((t, i) => (
              <tr
                key={t.id}
                className={`cursor-pointer transition-colors border-b border-slate-700/50 last:border-0 ${
                  selected?.id === t.id
                    ? "bg-indigo-900/30"
                    : i % 2 === 0
                    ? "bg-slate-800 hover:bg-slate-700/60"
                    : "bg-slate-800/50 hover:bg-slate-700/60"
                }`}
                onClick={() => setSelected(t)}
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.id}</td>
                <td className="px-4 py-3 text-slate-200">{t.title}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{t.module}</td>
                <td className={`px-4 py-3 text-xs ${priorityStyle[t.priority]}`}>{t.priority}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {t.duration > 0 ? t.duration.toFixed(1) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-xs text-slate-500">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, testCases.length)} of {testCases.length} test cases
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-2 py-1 text-xs rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            «
          </button>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-xs rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...")
              acc.push(p)
              return acc
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-500">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    page === p
                      ? "bg-indigo-600 text-white font-medium"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 text-xs rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            »
          </button>
        </div>
      </div>

      <DetailPanel test={selected} onClose={() => setSelected(null)} />
    </>
  )
}

export default TestTable