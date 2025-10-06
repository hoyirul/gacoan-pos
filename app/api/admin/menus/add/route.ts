import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const name = formData.get("name") as string
    const price = parseInt(formData.get("price") as string)
    const bom = JSON.parse(formData.get("bom") as string)

    let imageUrl: string | undefined = undefined
    const imageFile = formData.get("image") as File
    if (imageFile && imageFile.size > 0) {
      // Pastikan folder /public/uploads ada
      const uploadDir = path.join(process.cwd(), "public/uploads")
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filename = `${Date.now()}-${imageFile.name}`
      const filepath = path.join(uploadDir, filename)
      await fs.promises.writeFile(filepath, buffer)
      imageUrl = `/uploads/${filename}`
    }

    const menu = await prisma.menu.create({
      data: {
        name,
        price,
        imageUrl,
        bom: {
          create: bom.map((b: any) => ({
            ingredientId: b.ingredientId,
            quantity: b.quantity,
          })),
        },
      },
      include: { bom: { include: { ingredient: true } } },
    })

    return NextResponse.json(menu)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create menu" }, { status: 500 })
  }
}
