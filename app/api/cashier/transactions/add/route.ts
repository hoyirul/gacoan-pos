import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // body.items = [{ menuId: number, qty: number }]
    const items: { menuId: number; qty: number }[] = body.items

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    // Ambil menu & bom untuk semua menu yang dibeli
    const menuIds = items.map((i) => i.menuId)
    const menus = await prisma.menu.findMany({
      where: { id: { in: menuIds } },
      include: { bom: { include: { ingredient: true } } },
    })

    let totalPrice = 0
    const stockUpdates: { ingredientId: number; quantity: number }[] = []

    // Validasi stok dan hitung total
    for (const item of items) {
      const menu = menus.find((m) => m.id === item.menuId)
      if (!menu) continue
      totalPrice += menu.price * item.qty

      for (const bom of menu.bom) {
        const needed = bom.quantity * item.qty
        if (bom.ingredient.stock < needed) {
          return NextResponse.json(
            { error: `Stok ${bom.ingredient.name} tidak cukup` },
            { status: 400 }
          )
        }
        stockUpdates.push({ ingredientId: bom.ingredient.id, quantity: needed })
      }
    }

    // Kurangi stok & catat StockMutation
    for (const update of stockUpdates) {
      await prisma.ingredient.update({
        where: { id: update.ingredientId },
        data: { stock: { decrement: update.quantity } },
      })

      await prisma.stockMutation.create({
        data: {
          ingredientId: update.ingredientId,
          quantity: -update.quantity,
          type: "sale",
          note: "Transaksi kasir",
        },
      })
    }

    // Simpan transaksi
    const transaction = await prisma.transaction.create({
      data: {
        name: "Transaksi Kasir",
        items: JSON.stringify(items),
        totalPrice,
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 })
  }
}
