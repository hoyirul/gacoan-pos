# Gacoan POS (Point of Sale)

A simple but functional Point of Sale (POS) system for Gacoan-style F&B operations, built with Next.js App Router, Prisma ORM, and SQLite.

---

## ✨ Features

- ✅ Admin login
- ✅ Ingredient (bahan baku) management
- ✅ Menu management with BOM (Bill of Materials)
- ✅ Stok update with mutation history
- ✅ Auto-disable menu when ingredient stock is insufficient
- ✅ Transaction recording (name, total, menu list)
- ✅ Image upload support for menu items
- ✅ SQLite for fast local development

---

## 🛠️ Tech Stack

- **Next.js 13+ App Router**
- **Prisma ORM**
- **SQLite**
- **Tailwind CSS**
- **TypeScript**

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/gacoan-pos.git
cd gacoan-pos
```
### 2. Install dependencies
```bash
Copy code
npm install
```
### 3. Setup Prisma & Database
```bash
Copy code
npx prisma migrate dev --name init
(This will create the SQLite dev.db file and apply the schema.)

Optional: Generate Prisma client manually

bash
Copy code
npx prisma generate
```
### 4. Run the app
```bash
Copy code
npm run dev
App will be available at http://localhost:3000
```

🧪 Admin Credentials
You can manually create an admin user in the database.

Example seed script or via Prisma Studio:

```bash
Copy code
npx prisma studio
Create a user with:

ADMIN
username: admin
password: password

CASHIER
username: cashier
password: password

🗃️ Database Schema (Prisma)
User — for admin login

Ingredient — bahan baku

StockMutation — log perubahan stok

Menu — daftar makanan/minuman

BOM — bahan baku per menu

Transaction — data penjualan

📁 Folder Structure (simplified)
pgsql
Copy code
app/
  ├─ admin/
  │   ├─ ingredients/
  │   ├─ menu/
  │   ├─ transactions/
  │   └─ login/
  ├─ (user-facing)/
lib/
  └─ prisma.ts
prisma/
  └─ schema.prisma
📝 TODO / Improvements
 Upload image (menu) ke file storage atau Cloudinary

 Export laporan transaksi

 Role management (kasir, admin)

 Responsive UI

 API protection with middleware

📃 License
MIT — free to use for personal or commercial use.

🧑‍💻 Author
Built by @mochammadhairullah 🚀

yaml
Copy code

---
```
### ✅ Next Step

Simpan file ini sebagai `README.md` di root project kamu:

```bash
touch README.md
```