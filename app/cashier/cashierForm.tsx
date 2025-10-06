"use client"
import { useState, useMemo } from "react"

export default function CashierForm({ availableMenus }: any) {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredMenus = availableMenus.filter((menu: any) =>
    menu.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalItems = useMemo(
    () => Object.values(quantities).reduce((acc, val) => acc + val, 0),
    [quantities]
  )

  const totalPrice = useMemo(
    () =>
      availableMenus.reduce((acc: number, menu: any) => {
        const qty = quantities[menu.id] || 0
        return acc + menu.price * qty
      }, 0),
    [quantities, availableMenus]
  )

  if (availableMenus.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg mt-10">
        Belum ada menu tersedia 😢
      </p>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 pb-40">
        {/* Search */}
        <input
          type="text"
          placeholder="Cari menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 mb-4"
        />

        {/* Grid Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map((menu: any) => (
            <div
              key={menu.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-150"
            >
              <div className="mb-4">
                {menu.imageUrl && (
                  <img
                    src={menu.imageUrl}
                    alt={menu.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <h2 className="font-semibold text-gray-800 text-lg">{menu.name}</h2>
                <p className="text-gray-600 font-bold">
                  Rp {menu.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor={`menu-${menu.id}`}
                  className="flex-1 text-gray-700 text-sm"
                >
                  Jumlah:
                </label>
                <input
                  type="number"
                  id={`menu-${menu.id}`}
                  min={0}
                  value={quantities[menu.id] || 0}
                  onChange={(e) => handleChange(menu.id, e.target.value)}
                  className="border border-slate-200 rounded-lg p-2 w-20 text-center font-bold focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                />
              </div>
            </div>
          ))}
        </div>
      </form>

      {/* Fixed Bottom Summary */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="text-gray-700 font-medium text-center sm:text-left">
            Total Items: <span className="font-bold">{totalItems}</span> | Total Harga:{" "}
            <span className="font-bold">Rp {totalPrice.toLocaleString()}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || totalItems === 0}
            className="w-full sm:w-auto bg-emerald-500 text-white py-3 px-6 rounded-lg hover:bg-emerald-600 transition-all duration-150 disabled:opacity-50 cursor-pointer font-semibold"
          >
            {loading ? "Processing..." : "Submit Transaksi"}
          </button>
        </div>
      </div>
    </>
  )
}
