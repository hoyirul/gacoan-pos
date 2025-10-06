"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

    fetch("/api/transactions")
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

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>
        {/* back */}
        <a href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Dashboard
        </a>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Customer</th>
            <th className="border border-gray-300 px-4 py-2">Items</th>
            <th className="border border-gray-300 px-4 py-2">Total Price (Rp)</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const items = JSON.parse(tx.items) as { menuId: number; qty: number }[]
            return (
              <tr key={tx.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{tx.id}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {items.map((item, i) => (
                    <div key={i}>
                      {menus.get(item.menuId) || `Menu ID ${item.menuId}`}: {item.qty}
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2">{tx.totalPrice}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}
