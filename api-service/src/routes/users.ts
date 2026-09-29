import { Hono } from 'hono'
import type { Sql } from '../db'

export interface User {
  id: number
  email: string
  name: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

export function usersRoutes(sql: Sql): Hono {
  const app = new Hono()

  app.get('/', async (c) => {
    // Explicit column list: "password" must never reach an API response.
    const users = await sql<User[]>`
      SELECT id, email, name, role, "createdAt", "updatedAt"
      FROM "User"
      ORDER BY id
    `
    return c.json(users)
  })

  return app
}
