"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function MenuPage() {
  const router = useRouter()
  const [menus, setMenus] = useState<any[]>([])
  const [ingredients, setIngredients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Check session + fetch data
  useEffect(() => {
    const session = localStorage.getItem("session_user")
    if (!session) {
      router.push("/login")
      return
    }

    Promise.all([
      fetch("/api/menus").then((res) => res.json()),
      fetch("/api/ingredients").then((res) => res.json()),
    ])
      .then(([menusData, ingredientsData]) => {
        setMenus(menusData)
        setIngredients(ingredientsData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching data:", err)
        setLoading(false)
      })
  }, [router])

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const name = formData.get("name")
    const price = formData.get("price")
    const imageFile = formData.get("image") as File

    // Ambil BOM
    const bom: { ingredientId: number; quantity: number }[] = []
    ingredients.forEach((ing) => {
      const isChecked = formData.get(`bom-${ing.id}`)
      const qty = parseInt(formData.get(`qty-${ing.id}`) as string) || 0
      if (isChecked && qty > 0) {
        bom.push({ ingredientId: ing.id, quantity: qty })
      }
    })

    // Kirim FormData ke API
    const payload = new FormData()
    payload.append("name", name as string)
    payload.append("price", price as string)
    if (imageFile && imageFile.size > 0) payload.append("image", imageFile)
    payload.append("bom", JSON.stringify(bom))

    const res = await fetch("/api/menus/add", {
      method: "POST",
      body: payload,
    })

    if (res.ok) {
      const newMenu = await res.json()
      setMenus((prev) => [newMenu, ...prev])
      form.reset()
    } else {
      alert("Gagal menambahkan menu")
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold mb-6">Manage Menus</h1>
        {/* back */}
        <a href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Dashboard
        </a>
      </div>

      {/* Form tambah menu */}
      <form
        onSubmit={handleAddMenu}
        className="space-y-4 mb-8"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          placeholder="Menu Name"
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (in IDR)"
          required
          min={0}
          className="border p-2 rounded w-full"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          className="border p-2 rounded w-full"
        />

        <fieldset>
          <legend className="font-semibold mb-2">Ingredients (BOM)</legend>
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                id={`ing-${ingredient.id}`}
                name={`bom-${ingredient.id}`}
                value={ingredient.id}
                className="w-4 h-4"
              />
              <label htmlFor={`ing-${ingredient.id}`} className="flex-1">
                {ingredient.name}
              </label>
              <input
                type="number"
                name={`qty-${ingredient.id}`}
                placeholder="Qty"
                min={0}
                defaultValue={0}
                className="border p-1 rounded w-16"
              />
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded cursor-pointer"
        >
          Add Menu
        </button>
      </form>

      {/* Daftar menu */}
      <ul className="space-y-4">
        {menus.map((menu) => (
          <li key={menu.id} className="border p-4 rounded">
            <h2 className="font-bold text-lg">{menu.name} — Rp {menu.price}</h2>
            {menu.imageUrl && (
              <img src={menu.imageUrl} alt={menu.name} className="w-24 h-24 object-cover rounded mt-2" />
            )}
            <ul className="ml-4 list-disc mt-2">
              {menu.bom.map(({ ingredient, quantity }: any) => (
                <li key={ingredient.id}>
                  {ingredient.name} : {quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}
