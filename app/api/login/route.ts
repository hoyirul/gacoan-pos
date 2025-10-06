import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    // Ambil user pakai raw query, termasuk role
    const users = await prisma.$queryRaw<
      { id: number; username: string; password: string; role: string }[]
    >`SELECT id, username, password, role FROM User WHERE username = ${username}`

    const user = users[0]

    console.log(user)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Kirim username & role ke front-end
    return NextResponse.json({
      username: user.username,
      role: user.role,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
