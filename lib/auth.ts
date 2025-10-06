// lib/auth.ts
import { cookies } from "next/headers"

const SESSION_KEY = "session_user"

// Call this inside a Route Handler (API route or middleware)
export async function setAdminSession(username: string) {
  const cookie = await cookies()
  cookie.set(SESSION_KEY, username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 hari
  })
}

export async function getAdminSession() {
  const cookie = await cookies()
  const session = cookie.get(SESSION_KEY)
  return session?.value || null
}

export async function clearAdminSession() {
  const cookie = await cookies()
  cookie.set(SESSION_KEY, "", { maxAge: -1, path: "/" })
}
