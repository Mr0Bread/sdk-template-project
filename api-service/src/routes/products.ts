import { Hono } from 'hono'
import type { Sql } from '../db'

export interface Product {
  id: number
  name: string
  description: string | null
  // NUMERIC arrives as a string (same as the PHP service) to avoid float drift.
  price: string
  stock: number
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export function productsRoutes(sql: Sql): Hono {
  const app = new Hono()

  app.get('/', async (c) => {
    const products = await sql<Product[]>`
      SELECT id, name, description, price, stock, "imageUrl", "createdAt", "updatedAt"
      FROM "Product"
      ORDER BY id
    `
    return c.json(products)
  })

  return app
}
