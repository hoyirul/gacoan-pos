"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        const data = await res.json()
        console.log(data)
        // Simpan session di localStorage, termasuk role
        localStorage.setItem("session_user", JSON.stringify({
          username: data.username,
          role: data.role
        }))

        console.log(data)

        // Redirect sesuai role
        if (data.role === "admin") {
          router.push("/admin")
        } else if (data.role === "cashier") {
          router.push("/cashier")
        } else {
          setError("Role tidak valid")
        }
      } else if (res.status === 401) {
        setError("Login gagal. Cek username/password.")
      } else {
        setError("Terjadi kesalahan server.")
      }
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan jaringan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 text-white py-2 px-4 rounded w-full hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  )
}
