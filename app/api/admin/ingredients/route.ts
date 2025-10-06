import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(ingredients)
}
