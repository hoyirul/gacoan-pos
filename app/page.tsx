import { redirect } from "next/navigation"

export default function Home() {
  // Langsung arah ke /order
  redirect("/order")
}
