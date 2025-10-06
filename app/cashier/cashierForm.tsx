"use client"
import { useState } from "react"

export default function CashierForm({ availableMenus }: any) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (menuId: number, value: string) => {
    setQuantities((prev) => ({ ...prev, [menuId]: parseInt(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([menuId, qty]) => ({ menuId: parseInt(menuId), qty }))

    if (!items.length) return alert("Pilih minimal 1 menu")

    setLoading(true)
    try {
      const res = await fetch("/api/cashier/transactions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })
      if (res.ok) {
        alert("Transaksi berhasil")
        setQuantities({})
      } else {
        const data = await res.json()
        alert(data.error || "Gagal melakukan transaksi")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan jaringan")
    } finally {
      setLoading(false)
    }
  }

  if (availableMenus.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg mt-10">
        Belum ada menu tersedia 😢
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableMenus.map((menu: any) => (
        <div
          key={menu.id}
          className="bg-pink-50 border border-pink-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
        >
          <h2 className="font-semibold text-gray-800 mb-2">{menu.name}</h2>
          <p className="text-gray-600 mb-4">Rp {menu.price.toLocaleString()}</p>

          <div className="flex items-center">
            <label htmlFor={`menu-${menu.id}`} className="flex-1 text-gray-700 text-sm">
              Jumlah:
            </label>
            <input
              type="number"
              id={`menu-${menu.id}`}
              min={0}
              value={quantities[menu.id] || 0}
              onChange={(e) => handleChange(menu.id, e.target.value)}
              className="border border-pink-200 rounded-md p-1 w-20 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
        </div>
      ))}

      <div className="col-span-full text-center mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-300 text-white py-2 px-6 rounded-lg hover:bg-pink-400 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Processing..." : "Submit Transaksi"}
        </button>
      </div>
    </form>
  )
}
