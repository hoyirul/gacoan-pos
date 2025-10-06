"use client"

import { useState, useEffect } from "react"

export default function OrderPage() {
  const [menus, setMenus] = useState<any[]>([])
  const [loadingMenus, setLoadingMenus] = useState(true)

  useEffect(() => {
    // Fetch menus dari API
    fetch("/api/order/menus")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data)
        setLoadingMenus(false)
      })
      .catch((err) => {
        console.error(err)
        setLoadingMenus(false)
      })
  }, [])

  if (loadingMenus) {
    return <p className="text-center text-gray-500 mt-20">Loading menus...</p>
  }

  const availableMenus = menus.filter((menu) =>
    menu.bom.every((bom: any) => bom.ingredient.stock >= bom.quantity)
  )

  return (
    <main className="p-6 px-12 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-600">Self-Service Order</h1>
      </div>
      <div className="max-w-4xl mx-auto">
        <OrderForm availableMenus={availableMenus} />
      </div>
    </main>
  )
}

// -----------------------
// Form component
// -----------------------
function OrderForm({ availableMenus }: { availableMenus: any[] }) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [customerName, setCustomerName] = useState("")

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
        body: JSON.stringify({ items, name: customerName.trim()}),
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

  const filteredMenus = availableMenus.filter((menu) =>
    menu.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalItems = Object.values(quantities).reduce((acc, val) => acc + val, 0)
  const totalPrice = availableMenus.reduce((acc: number, menu: any) => {
    const qty = quantities[menu.id] || 0
    return acc + menu.price * qty
  }, 0)

  if (availableMenus.length === 0) {
    return <p className="text-center text-gray-500 text-lg mt-10">Belum ada menu tersedia 😢</p>
  }

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
          >
            <img
              src={menu.imageUrl || "/images/default.webp"}
              alt={menu.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-gray-800">{menu.name}</h2>
                  <span className="text-blue-600 font-bold">Rp {menu.price.toLocaleString()}</span>
                </div>

                {/* Input jumlah */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 justify-between">
                    {/* Tombol minus */}
                    <button
                      type="button"
                      onClick={() => handleChange(menu.id, String((quantities[menu.id] || 0) - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                      disabled={(quantities[menu.id] || 0) <= 0}
                    >
                      −
                    </button>

                    {/* Input read-only */}
                    <input
                      type="number"
                      id={`menu-${menu.id}`}
                      value={quantities[menu.id] || 0}
                      readOnly
                      className="w-16 text-center rounded-md p-1 bg-white font-bold text-xl"
                    />

                    {/* Tombol plus */}
                    <button
                      type="button"
                      onClick={() => handleChange(menu.id, String((quantities[menu.id] || 0) + 1))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        {filteredMenus.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-lg">
            {/* input name */}
            <div className="max-w-4xl mx-auto pt-4 px-4">
              <input
                type="text"
                required
                placeholder="Masukkan nama"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
                disabled={loading}
              />
            </div>
            <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-gray-700 font-medium text-center sm:text-left">
                Total Items: <span className="font-bold">{totalItems}</span> | Total Harga:{" "}
                <span className="font-bold">Rp {totalPrice.toLocaleString()}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || totalItems === 0 || customerName.trim() === ""}
                className="w-full sm:w-auto bg-emerald-500 text-white py-3 px-6 rounded-lg hover:bg-emerald-600 transition-all duration-150 disabled:opacity-50 cursor-pointer font-semibold"
              >
                {loading ? "Processing..." : "Submit Order"}
              </button>
            </div>
          </div>
        )}
      </form>
    </>
  )
}
