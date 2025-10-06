"use client"
import { useRouter } from "next/navigation"

export default function CashierHeader() {
  const router = useRouter()

  const handleLogout = () => {
    // Hapus session
    localStorage.removeItem("session_user")
    // Redirect ke login
    router.push("/login")
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-emerald-600">💵 Cashier Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}
