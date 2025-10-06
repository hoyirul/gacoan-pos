"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/mainLayout"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedSession = localStorage.getItem("session_user")
    if (!storedSession) {
      router.push("/login")
    } else {
      setSession(storedSession)
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <MainLayout title="Admin Dashboard">
      <main className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
        <p className="text-gray-700 mb-8">
          Selamat datang, <span className="font-medium text-gray-900">Administrator</span> 👋
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href="/admin/ingredients"
            className="block p-5 bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition"
          >
            <h2 className="text-lg font-semibold text-emerald-600 mb-1">🧂 Manage Ingredients</h2>
            <p className="text-sm text-gray-600">Kelola data bahan baku yang tersedia.</p>
          </a>

          <a
            href="/admin/stock-mutations"
            className="block p-5 bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition"
          >
            <h2 className="text-lg font-semibold text-emerald-600 mb-1">📦 Stock Mutations</h2>
            <p className="text-sm text-gray-600">Lihat dan catat perubahan stok.</p>
          </a>

          <a
            href="/admin/menus"
            className="block p-5 bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition"
          >
            <h2 className="text-lg font-semibold text-emerald-600 mb-1">🍽️ Manage Menus</h2>
            <p className="text-sm text-gray-600">Atur daftar menu yang tersedia.</p>
          </a>

          <a
            href="/admin/transactions"
            className="block p-5 bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition"
          >
            <h2 className="text-lg font-semibold text-emerald-600 mb-1">💳 View Transactions</h2>
            <p className="text-sm text-gray-600">Cek histori transaksi pelanggan.</p>
          </a>
        </section>
      </main>
    </MainLayout>
  )
}
