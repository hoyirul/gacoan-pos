// components/MainLayout.tsx
"use client"
import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Props = { 
  children: ReactNode; 
  title?: string; 
  backUrl?: string  // optional
}

export default function MainLayout({ children, title, backUrl }: Props) {
  const router = useRouter()
  const [session, setSession] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedSession = localStorage.getItem("session_user")
    if (!storedSession) {
      router.push("/login")
    } else {
      setSession(storedSession)
    }
    setLoading(false)
  }, [router])

  const handleButton = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      localStorage.removeItem("session_user")
      router.push("/login")
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <main className="p-6 px-12 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-600">{title || "Dashboard"}</h1>
        <button
          onClick={handleButton}
          className={`py-2 px-6 rounded-lg font-medium cursor-pointer ${backUrl ? 'bg-gray-400 text-white hover:bg-gray-500' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
        >
          {/* with icon */}
          {backUrl ? (<span>Home</span>) : <span>Logout</span>}
        </button>
      </div>
      {children}
    </main>
  )
}
