import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { env } from "@/lib/env"

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
  max: 20,
  idleTimeoutMillis: 30000,
})

// Create a Drizzle ORM instance
export const db = drizzle(pool)

// Export the pool for direct queries if needed
export { pool }
