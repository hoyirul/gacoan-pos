import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id, stock } = await req.json()

  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(id) },
    })

    if (!ingredient) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 })
    }

    const qtyChange = parseInt(stock)
    const newStock = ingredient.stock + qtyChange

    // Update stok bahan
    const updated = await prisma.ingredient.update({
      where: { id: ingredient.id },
      data: { stock: newStock },
    })

    // Catat mutasi stok
    await prisma.stockMutation.create({
      data: {
        ingredientId: ingredient.id,
        quantity: qtyChange, // bisa positif atau negatif
        type: qtyChange > 0 ? "add" : "reduce",
        note: "Manual stock adjustment",
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating stock:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
