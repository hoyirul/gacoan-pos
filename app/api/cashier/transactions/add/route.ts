// app/api/cashier/transactions/add/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const items: { menuId: number; qty: number }[] = body.items

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Ambil semua menu & BOM
    const menuIds = items.map(i => i.menuId)
    const menus = await prisma.menu.findMany({
      where: { id: { in: menuIds } },
      include: { bom: { include: { ingredient: true } } },
    })

    let totalPrice = 0
    const stockUpdates: { [ingredientId: number]: number } = {}
    
    console.log("Processing items:", items)

    // Hitung total harga & stok yang harus dikurangi
    for (const item of items) {
      const menu = menus.find(m => m.id === item.menuId)
      if (!menu) continue
      totalPrice += menu.price * item.qty

      for (const bom of menu.bom) {
        console.log("Checking ingredient", bom.ingredient.id, "needed for menu", menu.id)
        const needed = bom.quantity * item.qty
        if (bom.ingredient.stock < needed) {
          return NextResponse.json(
            { error: `Stok ${bom.ingredient.name} tidak cukup` },
            { status: 400 }
          )
        }
        stockUpdates[bom.ingredient.id] = (stockUpdates[bom.ingredient.id] || 0) + needed
      }
    }

    console.log("Stock updates needed:", stockUpdates)

    // Kurangi stok bahan & catat StockMutation
    for (const [ingredientIdStr, quantity] of Object.entries(stockUpdates)) {
      const ingredientId = parseInt(ingredientIdStr)
      if (!quantity || quantity <= 0) continue

      console.log("Updating ingredient", ingredientId, "by", quantity)

      await prisma.ingredient.update({
        where: { id: ingredientId },
        data: { stock: { decrement: quantity } },
      })

      await prisma.stockMutation.create({
        data: {
          ingredientId,
          quantity: quantity,
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
    console.error("Error processing transaction:", error)
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    )
  }
}
