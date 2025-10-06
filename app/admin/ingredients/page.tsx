"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
    fetch("/api/ingredients")
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
    const res = await fetch("/api/ingredients/add", {
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
    const res = await fetch("/api/ingredients/update", {
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
    <main className="p-6 max-w-3xl mx-auto">
      {/* between */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold mb-6">Manage Ingredients</h1>
        {/* back */}
        <a href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Dashboard
        </a>
      </div>

      {/* Form tambah bahan */}
      <form onSubmit={handleAddIngredient} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Ingredient Name"
          value={newIngredient.name}
          onChange={(e) =>
            setNewIngredient({ ...newIngredient, name: e.target.value })
          }
          required
          className="border p-2 rounded w-full"
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
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          Add Ingredient
        </button>
      </form>

      {/* List bahan & form tambah stok */}
      <ul className="mt-6 space-y-4">
        {ingredients.map((item) => (
          <li
            key={item.id}
            className="border p-4 rounded flex flex-col md:flex-row md:justify-between md:items-center gap-4"
          >
            <div className="flex flex-col gap-2">
              <span className="font-semibold">{item.name}</span>
              <span>Stock: {item.stock}</span>

              {/* Form edit nama */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const newName = (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value
                  const res = await fetch("/api/ingredients/edit", {
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
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  name="name"
                  defaultValue={item.name}
                  className="border p-2 rounded w-40"
                />
                <button
                  type="submit"
                  className="bg-rose-500 text-white px-3 py-2 rounded cursor-pointer"
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
              className="flex gap-2 items-center"
            >
              <input
                type="number"
                name="change"
                placeholder="+/- stok"
                required
                className="border p-2 rounded w-24"
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded"
              >
                Apply
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  )
}
