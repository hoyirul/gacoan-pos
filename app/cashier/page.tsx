// app/cashier/page.tsx (Server Component)
import { prisma } from "@/lib/prisma"
import CashierForm from "./cashierForm"
import MainLayout from "@/components/mainLayout"

export default async function CashierPage() {
  const menus = await prisma.menu.findMany({
    include: { bom: { include: { ingredient: true } } },
  })

  const availableMenus = menus.filter((menu) =>
    menu.bom.every((bom) => bom.ingredient.stock >= bom.quantity)
  )

  return (
    <MainLayout title="Cashier">
      <main className="max-w-4xl mx-auto">
        <CashierForm availableMenus={availableMenus} />
      </main>
    </MainLayout>
  )
}
