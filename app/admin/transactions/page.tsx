"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/mainLayout"

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [menus, setMenus] = useState<Map<number, string>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("session_user")
    if (!session) {
      router.push("/login")
      return
    }

    fetch("/api/admin/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions)

        const menuMap = new Map<number, string>()
        data.menus.forEach((menu: any) => menuMap.set(menu.id, menu.name))
        setMenus(menuMap)

        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err)
        setLoading(false)
      })
  }, [router])

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>

  return (
    <MainLayout title="Transactions" backUrl="/admin">
      <main className="max-w-5xl mx-auto">
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">ID</th>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">Customer</th>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">Items</th>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">Total Price (Rp)</th>
                <th className="px-4 py-3 text-left text-slate-700 font-medium border-b border-gray-200">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const items = JSON.parse(tx.items) as { menuId: number; qty: number }[]
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 border-b border-gray-100 text-slate-700">{tx.id}</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-slate-700 font-bold">{tx.name}</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-slate-700">
                        <ul className="list-disc list-inside space-y-1">
                          {items.map((item, i) => (
                            <li key={i} className="flex gap-1">
                              <span className="font-medium">{menus.get(item.menuId) || `Menu ID ${item.menuId}`}</span>
                              <span className="text-gray-600">× {item.qty}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 font-semibold text-slate-700 text-end">
                        Rp {tx.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-slate-500 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-6 text-gray-400">
                    Belum ada transaksi.
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
