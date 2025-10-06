"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/mainLayout"

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

    fetch("/api/admin/stock-mutations")
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
    <MainLayout title="Stock Mutations" backUrl="/admin">
      <main className="max-w-4xl mx-auto">
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">
                  Bahan
                </th>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">
                  Jumlah
                </th>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">
                  Tipe
                </th>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody>
              {mutations.length > 0 ? (
                mutations.map((m: any) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 border-b border-gray-100 text-slate-700">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-slate-700">
                      {m.ingredient?.name || "-"}
                    </td>
                    <td
                      className={`px-4 py-3 border-b border-gray-100 font-bold text-center ${
                        m.type != 'sale' ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {m.type != 'sale' ? `+${m.quantity}` : `-${m.quantity}`}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-slate-700">
                      {/* with badge */}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          m.type === "initial"
                            ? "bg-green-100 text-green-800"
                            : m.type === "add"
                            ? "bg-yellow-100 text-yellow-800"
                            : m.type === "sale"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {m.type.charAt(0).toUpperCase() + m.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-slate-500">
                      {m.note || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-4 py-6 text-gray-400"
                  >
                    Belum ada data mutasi stok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </MainLayout>
  )
}
