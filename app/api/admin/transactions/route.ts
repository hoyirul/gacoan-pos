// app/api/admin/stock-mutations/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    // Ambil semua menu yang ada di transaksi
    const allMenuIds = new Set<number>()
    transactions.forEach((tx) => {
      const items = JSON.parse(tx.items) as { menuId: number; qty: number }[]
      items.forEach((item) => allMenuIds.add(item.menuId))
    })

    const menus = await prisma.menu.findMany({
      where: { id: { in: Array.from(allMenuIds) } },
    })

    return NextResponse.json({ transactions, menus })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
