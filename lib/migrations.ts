import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"
import { env } from "@/lib/env"

// This script can be run with "node -r esbuild-register lib/migrations.ts"
async function main() {
  console.log("Starting database migration...")

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
  })

  const db = drizzle(pool)

  // This will automatically run needed migrations on the database
  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migration completed successfully")

  await pool.end()
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
