import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

async function main() {
  const sql = neon(process.env.DATABASE_URL!)

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name text`
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS business_email text`
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS business_phone text`
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS business_address text`
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS business_tax_number text`

  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS public_token text DEFAULT gen_random_uuid()::text NOT NULL`

  const [{ exists }] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'invoices_public_token_unique'
    ) AS exists
  `
  if (!exists) {
    await sql`ALTER TABLE invoices ADD CONSTRAINT invoices_public_token_unique UNIQUE (public_token)`
  }

  console.log('Migration done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
