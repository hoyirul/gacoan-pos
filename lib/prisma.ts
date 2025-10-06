// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

// Cek supaya Prisma Client gak dibuat ulang terus saat hot reload (di development)
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Optional, buat debug query SQL
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
