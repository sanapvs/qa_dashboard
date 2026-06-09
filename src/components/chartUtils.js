// chartUtils.js
export function aggregateTestData(testCases) {
  const trendsMap = {}

  testCases.forEach((tc) => {
    // Extracts 'YYYY-MM-DD' from 'YYYY-MM-DDTHH:mm:ss...' or defaults to 'Unknown'
    const dateStr = tc.lastRun ? tc.lastRun.split("T")[0] : "Unknown"

    // Initialize the date entry if it doesn't exist yet
    if (!trendsMap[dateStr]) {
      trendsMap[dateStr] = { date: dateStr, passed: 0, failed: 0, skipped: 0 }
    }

    // Increment the matching state counters (case-insensitive safely)
    const status = String(tc.status).toLowerCase()
    if (status === "passed") trendsMap[dateStr].passed++
    else if (status === "failed") trendsMap[dateStr].failed++
    else if (status === "skipped") trendsMap[dateStr].skipped++
  })

  // Convert map objects back to a list and sort chronologically by date
  return Object.values(trendsMap).sort((a, b) => new Date(a.date) - new Date(b.date))
}