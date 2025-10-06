// app/cashier/page.tsx (Server Component)
import { prisma } from "@/lib/prisma"
import CashierForm from "./cashierForm"
import CashierHeader from "./cashierHeader"

export default async function CashierPage() {
  const menus = await prisma.menu.findMany({
    include: { bom: { include: { ingredient: true } } },
  })

  const availableMenus = menus.filter((menu) =>
    menu.bom.every((bom) => bom.ingredient.stock >= bom.quantity)
  )

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <CashierHeader />
      <CashierForm availableMenus={availableMenus} />
    </main>
  )
}
