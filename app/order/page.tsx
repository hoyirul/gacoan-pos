"use client"

import { prisma } from "@/lib/prisma"
import { useState } from "react"

export default async function OrderPage() {
  const menus = await prisma.menu.findMany({
    include: { bom: { include: { ingredient: true } } },
  })

  const availableMenus = menus.filter((menu) =>
    menu.bom.every((bom) => bom.ingredient.stock >= bom.quantity)
  )

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        🧾 Self Service Order
      </h1>
      <OrderForm availableMenus={availableMenus} />
    </main>
  )
}

// -----------------------
// Form component
// -----------------------
function OrderForm({ availableMenus }: any) {
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

    if (items.length === 0) {
      alert("Pilih minimal 1 menu")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/order/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (res.ok) {
        alert("Pesanan berhasil dikirim 🎉")
        setQuantities({})
      } else {
        const data = await res.json()
        alert(data.error || "Gagal melakukan pesanan")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan jaringan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {availableMenus.length === 0 && (
        <p className="text-center text-gray-500 col-span-full text-lg">
          Belum ada menu tersedia 😢
        </p>
      )}

      {availableMenus.map((menu: any) => (
        <div
          key={menu.id}
          className="border rounded-xl shadow hover:shadow-md transition overflow-hidden bg-white flex flex-col"
        >
          {menu.imageUrl ? (
            <img
              src={menu.imageUrl}
              alt={menu.name}
              className="w-full h-40 object-cover"
            />
          ) : (
            // with public/images/default.webp
            <img
              src="/images/default.webp"
              alt="Default Menu"
              className="w-full h-40 object-cover"
            />
          )}

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg text-gray-800">{menu.name}</h2>
                <span className="text-blue-600 font-medium">
                  Rp {menu.price.toLocaleString()}
                </span>
              </div>

              <label className="block text-sm text-gray-600 mb-1">Jumlah:</label>
              <input
                type="number"
                min={0}
                value={quantities[menu.id] || 0}
                onChange={(e) => handleChange(menu.id, e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      ))}

      {availableMenus.length > 0 && (
        <div className="col-span-full text-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Processing..." : "🛒 Pesan Sekarang"}
          </button>
        </div>
      )}
    </form>
  )
}
