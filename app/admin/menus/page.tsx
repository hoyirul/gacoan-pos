"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/mainLayout"

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
      fetch("/api/admin/menus").then((res) => res.json()),
      fetch("/api/admin/ingredients").then((res) => res.json()),
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

    const name = formData.get("name") as string
    const price = formData.get("price") as string
    const imageFile = formData.get("image") as File

    // Ambil BOM
    const bom: { ingredientId: number; quantity: number }[] = []

    ingredients.forEach((ing) => {
      const isChecked = formData.has(`bom-${ing.id}`)
      const qty = parseInt(formData.get(`qty-${ing.id}`) as string) || 0

      if (isChecked) {
        if (qty < 1) {
          alert(`Jumlah untuk bahan "${ing.name}" minimal 1!`)
          return
        }
        bom.push({ ingredientId: ing.id, quantity: qty })
      }
    })

    if (bom.length === 0) {
      alert("Pilih minimal 1 ingredient dengan jumlah minimal 1!")
      return
    }

    // Kirim FormData ke API
    const payload = new FormData()
    payload.append("name", name)
    payload.append("price", price)
    if (imageFile && imageFile.size > 0) payload.append("image", imageFile)
    payload.append("bom", JSON.stringify(bom))

    const res = await fetch("/api/admin/menus/add", { method: "POST", body: payload })

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
    <MainLayout title="Manage Menus" backUrl="/admin">
      <main className="max-w-4xl mx-auto space-y-8">
        {/* Form tambah menu */}
        <form
          onSubmit={handleAddMenu}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Menu Name"
              required
              className="col-span-2 border border-gray-300 p-2 rounded-lg w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Price (IDR)"
              min={0}
              required
              className="border border-gray-300 p-2 rounded-lg w-full"
            />
          </div>

          <input
            type="file"
            name="image"
            required
            accept="image/*"
            className="border border-gray-300 p-2 rounded-lg w-full"
          />

          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-2">
            <legend className="font-semibold text-gray-700">Ingredients (BOM)</legend>
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center gap-3 bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  id={`ing-${ingredient.id}`}
                  name={`bom-${ingredient.id}`}
                  value={ingredient.id}
                  className="w-4 h-4"
                />
                <label htmlFor={`ing-${ingredient.id}`} className="flex-1 text-gray-700">
                  {ingredient.name}
                </label>
                <input
                  type="number"
                  name={`qty-${ingredient.id}`}
                  placeholder="Qty"
                  min={1}
                  defaultValue={1}
                  className="border border-gray-300 p-1 rounded w-16 text-center"
                />
              </div>
            ))}
          </fieldset>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-lg w-full font-semibold hover:bg-green-700 transition"
          >
            Add Menu
          </button>
        </form>

        {/* Daftar menu */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menus.map((menu) => (
            <li
              key={menu.id}
              className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 flex flex-col items-start gap-2"
            >
              <div className="flex justify-between w-full items-center">
                <h2 className="font-bold text-lg text-gray-800">
                  {menu.name}
                </h2>
                <span className="text-gray-600 font-medium">Rp {menu.price}</span>
              </div>

              {menu.imageUrl && (
                <img
                  src={menu.imageUrl}
                  alt={menu.name}
                  className="w-full h-36 object-cover rounded-lg mt-2"
                />
              )}

              {menu.bom.length > 0 && (
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {menu.bom.map(({ ingredient, quantity }: any) => (
                    <div
                      key={ingredient.id}
                      className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium text-gray-700"
                    >
                      <span>{ingredient.name}</span>
                      <span className="font-bold mx-2">{quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </MainLayout>
  )
}
