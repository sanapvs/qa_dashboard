import { useState, useEffect } from "react"

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

function DetailPanel({ test, onClose }) {
  if (!test) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-xs text-gray-400 mb-1">{test.id}</p>
            <p className="font-semibold text-gray-800 text-base leading-snug">{test.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-4">✕</button>
        </div>

        <div className="space-y-4 text-sm">
          <Row label="Status">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[test.status]}`}>
              {test.status}
            </span>
          </Row>
          <Row label="Module"><span className="text-gray-700">{test.module}</span></Row>
          <Row label="Priority"><span className={priorityStyle[test.priority]}>{test.priority}</span></Row>
          <Row label="Duration">
            <span className="font-mono text-gray-600">
              {test.duration > 0 ? `${test.duration.toFixed(1)}s` : "—"}
            </span>
          </Row>
          <Row label="Last run">
            <span className="text-gray-600">
              {new Date(test.lastRun).toLocaleString("en-IN", {
                dateStyle: "medium", timeStyle: "short"
              })}
            </span>
          </Row>

          {test.tags?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {test.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {test.errorMessage && (
            <div>
              <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-2">Error message</p>
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 font-mono text-xs text-red-700 leading-relaxed">
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
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-24 shrink-0">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  )
}

const PAGE_SIZE = 10

function TestTable({ testCases }) {
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever the data changes (e.g. filter or upload)
  useEffect(() => {
    setPage(1)
  }, [testCases])

  const totalPages = Math.ceil(testCases.length / PAGE_SIZE)
  const paginated = testCases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (!testCases.length) {
    return (
      <p className="text-center text-gray-400 py-10 text-sm">
        No test cases match your filters.
      </p>
    )
  }

  return (
    <>
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
            {paginated.map((t, i) => (
              <tr
                key={t.id}
                className={`cursor-pointer transition-colors ${
                  selected?.id === t.id
                    ? "bg-blue-50"
                    : i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50/50 hover:bg-gray-100"
                }`}
                onClick={() => setSelected(t)}
              >
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

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-xs text-gray-400">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, testCases.length)} of {testCases.length} test cases
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            «
          </button>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
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
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 text-xs rounded ${
                    page === p
                      ? "bg-blue-500 text-white font-medium"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
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