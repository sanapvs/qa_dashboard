function StatCards({ testCases }) {
  const total = testCases.length
  const passed = testCases.filter(t => t.status === "Passed").length
  const failed = testCases.filter(t => t.status === "Failed").length
  const rate = total ? Math.round((passed / total) * 100) : 0
  const critFailed = testCases.filter(t => t.status === "Failed" && t.priority === "High").length

  const cards = [
    {
      label: "Total Tests",
      value: total,
      sub: "across all modules",
      icon: "🧪",
      iconBg: "bg-indigo-50",
      barColor: "bg-indigo-500",
      barWidth: "100%",
    },
    {
      label: "Pass Rate",
      value: rate + "%",
      sub: `${passed} of ${total} tests`,
      icon: "✓",
      iconBg: "bg-green-50",
      barColor: "bg-green-500",
      barWidth: rate + "%",
    },
    {
      label: "Critical Failures",
      value: critFailed,
      sub: "high-priority failed",
      icon: "⚠",
      iconBg: "bg-red-50",
      barColor: "bg-red-500",
      barWidth: Math.min((critFailed / (total || 1)) * 400, 100) + "%",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map(card => (
        <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{card.label}</span>
            <div className={`w-7 h-7 ${card.iconBg} rounded-lg flex items-center justify-center text-sm`}>
              {card.icon}
            </div>
          </div>
          <div className="font-mono text-2xl font-medium text-slate-900 leading-none mb-1">
            {card.value}
          </div>
          <div className="text-xs text-slate-400 mb-3">{card.sub}</div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${card.barColor} rounded-full transition-all duration-500`}
              style={{ width: card.barWidth }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatCards