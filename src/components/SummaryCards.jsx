function SummaryCards({ testCases }) {
  const total = testCases.length
  const passed = testCases.filter(t => t.status === "Passed").length
  const failed = testCases.filter(t => t.status === "Failed").length
  const skipped = testCases.filter(t => t.status === "Skipped").length

  const cards = [
    { label: "Total", value: total, color: "text-gray-800" },
    { label: "Passed", value: passed, color: "text-green-700" },
    { label: "Failed", value: failed, color: "text-red-600" },
    { label: "Skipped", value: skipped, color: "text-amber-600" },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {cards.map(card => (
        <div key={card.label} className="bg-gray-100 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">{card.label}</p>
          <p className={`text-3xl font-semibold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards