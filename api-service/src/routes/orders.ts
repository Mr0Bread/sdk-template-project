import { Hono } from 'hono'
import type { Sql } from '../db'

interface OrderRow {
  id: number
  userId: number
  totalAmount: string
  statusId: number
  statusName: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: number
  userId: number
  // Serialised as a JSON number, same as the Java service (BigDecimal).
  totalAmount: number
  status: { id: number; name: string }
  createdAt: Date
  updatedAt: Date
}

export function ordersRoutes(sql: Sql): Hono {
  const app = new Hono()

  app.get('/', async (c) => {
    const rows = await sql<OrderRow[]>`
      SELECT o.id, o."userId", o."totalAmount", o."createdAt", o."updatedAt",
             s.id AS "statusId", s.name AS "statusName"
      FROM orders o
      JOIN order_statuses s ON s.id = o."statusId"
      ORDER BY o.id
    `
    // The frontend reads order.status.name, so keep the nested status object.
    const orders: Order[] = rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      totalAmount: Number(r.totalAmount),
      status: { id: r.statusId, name: r.statusName },
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))
    return c.json(orders)
  })

  return app
}
