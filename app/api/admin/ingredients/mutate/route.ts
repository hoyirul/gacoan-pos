// app/api/admin/ingredients/mutate/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { ingredientId, quantity, type, note } = await req.json()

  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(ingredientId) },
    })

    if (!ingredient) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 })
    }

    const qty = parseInt(quantity)

    // Buat record di StockMutation
    await prisma.stockMutation.create({
      data: {
        ingredientId: ingredient.id,
        quantity: qty,
        type,
        note: note || null,
      },
    })

    // Update stok bahan
    const updated = await prisma.ingredient.update({
      where: { id: ingredient.id },
      data: { stock: ingredient.stock + qty },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error mutating stock:", error)
    return NextResponse.json({ error: "Failed to mutate stock" }, { status: 500 })
  }
}
