import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { createdAt: "desc" },
      include: { bom: { include: { ingredient: true } } },
    })
    return NextResponse.json(menus)
  } catch (error) {
    console.error("Error fetching menus:", error)
    return NextResponse.json({ error: "Failed to fetch menus" }, { status: 500 })
  }
}
