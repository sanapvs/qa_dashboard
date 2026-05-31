import { useRef, useState } from "react"
import Papa from "papaparse"

function FileUpload({ onDataLoaded }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")
  const [success, setSuccess] = useState("")

  function handleFile(file) {
    setError("")
    setSuccess("")
    setFileName(file.name)

    if (!file.name.endsWith(".json") && !file.name.endsWith(".csv")) {
      setError("Only .json or .csv files are supported.")
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target.result
      try {
        if (file.name.endsWith(".json")) {
          parseJSON(content, file.name)
        } else {
          parseCSV(content, file.name)
        }
      } catch (err) {
        setError("Failed to parse file: " + err.message)
      }
    }

    reader.readAsText(file)
  }

  function parseJSON(content, fileName) {
    const parsed = JSON.parse(content)

    // Support both { testCases: [...] } and a raw array
    const cases = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.testCases)
      ? parsed.testCases
      : null

    if (!cases) {
      setError("JSON must contain a 'testCases' array or be a raw array of test cases.")
      return
    }

    const validated = validateAndNormalize(cases)
    if (validated.error) { setError(validated.error); return }

    setSuccess(`Loaded ${validated.data.length} test cases from ${fileName}`)
    onDataLoaded(validated.data)
  }

  function parseCSV(content, fileName) {
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
    })

    if (result.errors.length > 0) {
      setError("CSV parse error: " + result.errors[0].message)
      return
    }

    // Normalize CSV rows to match our test case shape
    const cases = result.data.map((row, i) => ({
      id: row.id || row.ID || `TC-${String(i + 1).padStart(3, "0")}`,
      title: row.title || row.Title || row.name || row.Name || "",
      module: row.module || row.Module || "General",
      priority: row.priority || row.Priority || "Medium",
      status: row.status || row.Status || "Skipped",
      duration: parseFloat(row.duration || row.Duration || 0) || 0,
      lastRun: row.lastRun || row.last_run || new Date().toISOString(),
      tags: row.tags ? row.tags.split(",").map(t => t.trim()) : [],
      errorMessage: row.errorMessage || row.error_message || row.error || "",
    }))

    const validated = validateAndNormalize(cases)
    if (validated.error) { setError(validated.error); return }

    setSuccess(`Loaded ${validated.data.length} test cases from ${fileName}`)
    onDataLoaded(validated.data)
  }

  function validateAndNormalize(cases) {
    if (cases.length === 0) {
      return { error: "File contains no test cases." }
    }

    const VALID_STATUSES = ["Passed", "Failed", "Skipped"]
    const VALID_PRIORITIES = ["High", "Medium", "Low"]

    const normalized = cases.map((t, i) => {
      if (!t.title) {
        throw new Error(`Row ${i + 1} is missing a 'title' field.`)
      }

      const status = VALID_STATUSES.find(
        s => s.toLowerCase() === String(t.status || "").toLowerCase()
      ) || "Skipped"

      const priority = VALID_PRIORITIES.find(
        p => p.toLowerCase() === String(t.priority || "").toLowerCase()
      ) || "Medium"

      return {
        id: t.id || `TC-${String(i + 1).padStart(3, "0")}`,
        title: t.title,
        module: t.module || "General",
        priority,
        status,
        duration: parseFloat(t.duration) || 0,
        lastRun: t.lastRun || new Date().toISOString(),
        tags: Array.isArray(t.tags) ? t.tags : [],
        errorMessage: t.errorMessage || "",
      }
    })

    return { data: normalized }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function onDragLeave() {
    setDragging(false)
  }

  function onInputChange(e) {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  return (
    <div className="mb-6">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json,.csv"
          className="hidden"
          onChange={onInputChange}
        />
        <p className="text-2xl mb-2">📂</p>
        <p className="text-sm font-medium text-gray-600">
          Drag & drop a file here, or <span className="text-blue-500">browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Supports .json and .csv</p>
      </div>

      {error && (
        <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700">
          ⚠ {error}
        </div>
      )}

      {success && (
        <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-700">
          ✓ {success}
        </div>
      )}
    </div>
  )
}

export default FileUpload