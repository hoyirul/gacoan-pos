// app/api/admin/ingredients/add/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, stock } = await req.json()

  try {
    const initialStock = parseInt(stock)

    // Buat ingredient baru
    const ingredient = await prisma.ingredient.create({
      data: { name, stock: initialStock },
    })

    // Catat mutasi stok awal
    await prisma.stockMutation.create({
      data: {
        ingredientId: ingredient.id,
        quantity: initialStock,
        type: "initial",
        note: "Initial stock",
      },
    })

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error("Error creating ingredient:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
