import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import { users } from '@/db/schema'

const db = drizzle(process.env.DATABASE_URL!)

async function main() {
  const user: typeof users.$inferInsert = {
    name: 'John',
    clerkId: 'user_2abc123def456ghi789jkl', // Clerk'ten gelen ID
    email: 'john@example.com'
  }

  await db.insert(users).values(user)
  console.log('New user created!')

  const usersTable = await db.select().from(users)
  console.log('Getting all users from the database: ', usersTable)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(users)
    .set({
      name: 'John Doe'
    })
    .where(eq(users.email, user.email))
  console.log('User info updated!')

  await db.delete(users).where(eq(users.email, user.email))
  console.log('User deleted!')
}

main()
