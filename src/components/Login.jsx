import { useState } from "react"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("login") // "login" or "register"

  async function handleSubmit() {
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }

    setLoading(true)

    try {
      const endpoint = mode === "login"
        ? "http://localhost:4000/api/auth/login"
        : "http://localhost:4000/api/auth/register"

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong.")
        return
      }

      // Store JWT token instead of just the email
      localStorage.setItem("qa_token", data.token)
      localStorage.setItem("qa_user", JSON.stringify({ email: data.email }))
      onLogin({ email: data.email })

    } catch (err) {
      setError("Could not connect to server. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0F172A" }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white">QA Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Hapticware Intelligence</p>
        </div>

        {/* Toggle login/register */}
        <div className="flex rounded-lg p-1 mb-6" style={{ background: "rgba(255,255,255,0.06)" }}>
          {["login", "register"].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError("") }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                mode === m
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
            <input
              type="email"
              placeholder="you@hapticware.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="w-full text-sm px-3 py-2.5 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800 border border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="w-full text-sm px-3 py-2.5 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800 border border-slate-700"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition-colors capitalize"
          >
            {loading ? "Please wait..." : mode}
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Secured with JWT + bcrypt
        </p>
      </div>
    </div>
  )
}

export default Login