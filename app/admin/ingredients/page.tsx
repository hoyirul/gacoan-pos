"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/mainLayout"

export default function IngredientsPage() {
  const router = useRouter()
  const [ingredients, setIngredients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newIngredient, setNewIngredient] = useState({ name: "", stock: 0 })

  // ✅ Cek session di localStorage
  useEffect(() => {
    const session = localStorage.getItem("session_user")
    if (!session) {
      router.push("/login")
      return
    }

    // Fetch data dari API
    fetch("/api/admin/ingredients")
      .then((res) => res.json())
      .then((data) => {
        setIngredients(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching ingredients:", err)
        setLoading(false)
      })
  }, [router])

  // ✅ Tambah bahan baru
  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/admin/ingredients/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIngredient),
    })
    if (res.ok) {
      const newItem = await res.json()
      setIngredients((prev) => [newItem, ...prev])
      setNewIngredient({ name: "", stock: 0 })
    } else {
      alert("Gagal nambah bahan")
    }
  }

  // ✅ Tambah/Kurang stok
  const handleChangeStock = async (id: number, change: number) => {
    const res = await fetch("/api/admin/ingredients/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock: change }),
    })

    if (res.ok) {
      const updated = await res.json()
      setIngredients((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: updated.stock } : item
        )
      )
    } else {
      alert("Gagal ubah stok")
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <MainLayout title="Manage Ingredients" backUrl="/admin">
      <main className="max-w-4xl mx-auto">
        {/* Form tambah bahan */}
        <form onSubmit={handleAddIngredient} className="space-y-4 mb-6">
          <div className="grid grid-cols-12 gap-4">
            <input
              type="text"
              placeholder="Ingredient Name"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, name: e.target.value })
              }
              required
              className="col-span-9 border border-gray-300 bg-white px-4 p-2 rounded-lg w-full"
            />
            <input
              type="number"
              placeholder="Initial Stock"
              min={0}
              value={newIngredient.stock}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, stock: parseInt(e.target.value) })
              }
              required
              className="col-span-3 border border-gray-300 bg-white px-4 p-2 rounded-lg w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg w-full cursor-pointer font-semibold hover:bg-sky-600 transition"
          >
            Add Ingredient
          </button>
        </form>

        {/* List bahan & form tambah stok */}
        <ul className="mt-6 space-y-4">
  {ingredients.map((item) => (
    <li
      key={item.id}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition hover:shadow-md"
    >
      {/* Info & edit nama */}
      <div className="flex flex-col gap-2 w-full md:w-1/2">
        <span className="font-semibold text-slate-800 text-lg">{item.name}</span>
        <span className="text-slate-600">Stock: {item.stock}</span>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const newName = (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value
            const res = await fetch("/api/admin/ingredients/edit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: item.id, name: newName }),
            })
            if (res.ok) {
              const updated = await res.json()
              setIngredients((prev) =>
                prev.map((ing) => (ing.id === item.id ? updated : ing))
              )
            }
          }}
          className="flex gap-2 items-center mt-2 flex-wrap"
        >
          <input
            type="text"
            name="name"
            defaultValue={item.name}
            className="border border-slate-300 px-3 py-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <button
            type="submit"
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Update Name
          </button>
        </form>
      </div>

      {/* Form tambah stok */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const change = parseInt(
            (e.currentTarget.elements.namedItem("change") as HTMLInputElement).value
          )
          handleChangeStock(item.id, change)
          ;(e.currentTarget.elements.namedItem("change") as HTMLInputElement).value = ""
        }}
        className="flex gap-2 items-center mt-3 md:mt-0"
      >
        <input
          type="number"
          name="change"
          placeholder="+/- stok"
          required
          className="border border-slate-300 px-3 py-2 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
        >
          Apply
        </button>
      </form>
    </li>
  ))}
</ul>
      </main>
    </MainLayout>
  )
}
