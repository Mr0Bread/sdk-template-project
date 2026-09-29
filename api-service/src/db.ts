import postgres from 'postgres'

export type Sql = postgres.Sql

/**
 * Create a Postgres client from the same DB_* variables the other services use.
 * The client connects lazily, so the service starts even if the database is
 * still booting; the first request that needs it will connect (or fail with 500).
 */
export function createSql(env: NodeJS.ProcessEnv): Sql {
  return postgres({
    host: env.DB_HOST ?? 'database',
    port: Number(env.DB_PORT ?? '5432'),
    database: env.DB_NAME ?? 'ecommerce_db',
    username: env.DB_USER ?? 'user',
    password: env.DB_PASSWORD ?? 'password',
  })
}
