// app/api/admin/ingredients/edit/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id, name } = await req.json()

  try {
    const updated = await prisma.ingredient.update({
      where: { id: parseInt(id) },
      data: { name },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating ingredient name:", error)
    return NextResponse.json({ error: "Failed to update name" }, { status: 500 })
  }
}
