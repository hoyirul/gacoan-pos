import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const mutations = await prisma.stockMutation.findMany({
      orderBy: { createdAt: "desc" },
      include: { ingredient: true },
      take: 50,
    })

    return NextResponse.json(mutations)
  } catch (error) {
    console.error("Error fetching stock mutations:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
