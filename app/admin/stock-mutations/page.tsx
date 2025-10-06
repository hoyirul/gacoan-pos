"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function StockMutationPage() {
  const router = useRouter()
  const [mutations, setMutations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("session_user")
    if (!session) {
      router.push("/login")
      return
    }

    fetch("/api/stock-mutations")
      .then((res) => res.json())
      .then((data) => {
        setMutations(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching mutations:", err)
        setLoading(false)
      })
  }, [router])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold mb-6">Stock Mutations</h1>
        {/* back */}
        <a href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Dashboard
        </a>
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Tanggal</th>
            <th className="border px-4 py-2">Bahan</th>
            <th className="border px-4 py-2">Jumlah</th>
            <th className="border px-4 py-2">Tipe</th>
            <th className="border px-4 py-2">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {mutations.length > 0 ? (
            mutations.map((m: any) => (
              <tr key={m.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  {new Date(m.createdAt).toLocaleString()}
                </td>
                <td className="border px-4 py-2">{m.ingredient?.name || "-"}</td>
                <td
                  className={`border px-4 py-2 ${
                    m.quantity > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                </td>
                <td className="border px-4 py-2">{m.type}</td>
                <td className="border px-4 py-2">{m.note || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center border px-4 py-6 text-gray-500"
              >
                Belum ada data mutasi stok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}
