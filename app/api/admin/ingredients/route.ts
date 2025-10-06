// app/api/admin/ingredients/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { createdAt: "desc" },
    include: { bom: { include: { menu: true } } },
  })
  return NextResponse.json(ingredients)
}
