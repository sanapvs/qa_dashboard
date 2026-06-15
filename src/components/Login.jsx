import { useState } from "react"
import logo from "./logo.svg" 

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

       
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 overflow-hidden">
            <img src={logo} alt="Hapticware Logo" className="w-6 h-6 object-contain" />
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