import { useState } from "react"
import logo from "./logo.svg"
function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("login") // login | register | verify

  async function handleSubmit() {
    setError("")
    setInfo("")

    if (mode === "verify") {
      if (!code) { setError("Please enter the verification code."); return }
      setLoading(true)
      try {
        const res = await fetch("http://localhost:4000/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error); return }

        localStorage.setItem("qa_token", data.token)
        localStorage.setItem("qa_user", JSON.stringify({ email: data.email }))
        onLogin({ email: data.email })
      } catch {
        setError("Could not connect to server.")
      } finally {
        setLoading(false)
      }
      return
    }

    if (!email || !password) { setError("Please enter both email and password."); return }

    if (mode === "register") {
      if (password.length < 6) { setError("Password must be at least 6 characters."); return }
      if (password !== confirmPassword) { setError("Passwords do not match."); return }
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
        if (data.needsVerification) {
          setMode("verify")
          setInfo("Please enter the code sent to your email.")
          return
        }
        setError(data.error || "Something went wrong.")
        return
      }

      if (mode === "register") {
        setMode("verify")
        setInfo("We've sent a 6-digit code to your email.")
        return
      }

      // login success
      localStorage.setItem("qa_token", data.token)
      localStorage.setItem("qa_user", JSON.stringify({ email: data.email }))
      onLogin({ email: data.email })

    } catch {
      setError("Could not connect to server. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError("")
    setInfo("")
    try {
      const res = await fetch("http://localhost:4000/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setInfo("New code sent to your email.")
    } catch {
      setError("Could not connect to server.")
    }
  }

  function switchMode(m) {
    setMode(m)
    setError("")
    setInfo("")
    setPassword("")
    setConfirmPassword("")
    setCode("")
  }

  const eyeIcon = (open) => open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M9.363 5.365A9.466 9.466 0 0112 5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228A10.45 10.45 0 001.935 12.5 10.523 10.523 0 005.225 17.275m4.575-9.625A3 3 0 0112 12" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0F172A" }}>
      <div className="w-full max-w-sm rounded-2xl p-8 bg-slate-800 border border-slate-700">

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 overflow-hidden">
            <img src={logo} alt="Hapticware Logo" className="w-6 h-6 object-contain" />
          </div>
          <h1 className="text-xl font-semibold text-white">QA Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Hapticware Intelligence</p>
        </div>

        {mode !== "verify" && (
          <div className="flex rounded-lg p-1 mb-6 bg-slate-900">
            {["login", "register"].map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                  mode === m ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">

          {mode === "verify" ? (
            <>
              <p className="text-sm text-slate-300 text-center mb-2">
                Enter the 6-digit code sent to <span className="text-white font-medium">{email}</span>
              </p>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono px-3 py-3 rounded-lg text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-900 border border-slate-700"
              />
              <button
                onClick={handleResend}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors w-full text-center"
              >
                Didn't get a code? Resend
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="you@hapticware.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className="w-full text-sm px-3 py-2.5 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-900 border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    className="w-full text-sm px-3 py-2.5 pr-10 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-900 border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {eyeIcon(showPassword)}
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      className="w-full text-sm px-3 py-2.5 pr-10 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-900 border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {eyeIcon(showConfirmPassword)}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
                  )}
                </div>
              )}
            </>
          )}

          {info && (
            <p className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
              {info}
            </p>
          )}
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
            {loading ? "Please wait..." : mode === "verify" ? "Verify" : mode}
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