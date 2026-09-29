import { serve } from '@hono/node-server'
import { createApp } from './app'
import { createSql } from './db'

const sql = createSql(process.env)
const port = Number(process.env.PORT ?? '8000')

const server = serve({ fetch: createApp(sql).fetch, port, hostname: '0.0.0.0' })

// Close the HTTP server (idle keep-alive connections are closed by Node) and
// the DB pool cleanly on `docker compose stop`.
process.on('SIGTERM', () => {
  server.close(() => {
    sql.end().finally(() => process.exit(0))
  })
})
