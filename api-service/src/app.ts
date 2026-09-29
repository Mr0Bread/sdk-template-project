import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Sql } from './db'
import { ordersRoutes } from './routes/orders'
import { productsRoutes } from './routes/products'
import { usersRoutes } from './routes/users'

export function createApp(sql: Sql): Hono {
  const app = new Hono()

  // Public, stateless API: no cookies or Authorization, so the wildcard origin
  // is valid (credentials stay off). Replace "*" if authentication is added.
  app.use('*', cors({ origin: '*' }))

  app.get('/', (c) => c.json({ message: 'API Service is running' }))

  app.route('/products', productsRoutes(sql))
  app.route('/users', usersRoutes(sql))
  app.route('/orders', ordersRoutes(sql))

  app.notFound((c) => c.json({ error: 'Not found' }, 404))

  // Log the real cause server-side; never leak DB error text to clients.
  app.onError((err, c) => {
    console.error(err)
    return c.json({ error: 'Internal server error' }, 500)
  })

  return app
}
