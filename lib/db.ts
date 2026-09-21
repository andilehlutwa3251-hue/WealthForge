import { Pool, type ClientBase } from 'pg'
import { Signer } from '@aws-sdk/rds-signer'
import { attachDatabasePool } from '@vercel/functions'
import { awsCredentialsProvider } from '@vercel/functions/oidc'

const signer = new Signer({
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN,
    clientConfig: { region: process.env.AWS_REGION },
  }),
  region: process.env.AWS_REGION,
  hostname: process.env.PGHOST,
  username: process.env.PGUSER || 'postgres',
  port: Number(process.env.PGPORT || 5432),
})

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE || 'postgres',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: () => signer.getAuthToken(),
  ssl: { rejectUnauthorized: false },
  max: 20,
})

attachDatabasePool(pool)

export function query(text: string, params?: unknown[]) {
  return pool.query(text, params)
}

export async function withConnection<T>(fn: (client: ClientBase) => Promise<T>) {
  const client = await pool.connect()
  try {
    return await fn(client)
  } finally {
    client.release()
  }
}

export async function ensureWaitlistTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS wealthforge_waitlist (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export async function ensureSubscriptionsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS wealthforge_subscriptions (
      id BIGSERIAL PRIMARY KEY,
      stripe_customer_id TEXT NOT NULL UNIQUE,
      stripe_subscription_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      plan TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      current_period_start TIMESTAMPTZ,
      current_period_end TIMESTAMPTZ,
      amount_paid_cents BIGINT DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export async function recordSubscription(
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  email: string,
  plan: string,
  currentPeriodStart: number,
  currentPeriodEnd: number
) {
  await query(
    `INSERT INTO wealthforge_subscriptions 
    (stripe_customer_id, stripe_subscription_id, email, plan, status, current_period_start, current_period_end, updated_at) 
    VALUES ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7), NOW())
    ON CONFLICT (stripe_subscription_id) DO UPDATE SET
      status = EXCLUDED.status,
      current_period_start = EXCLUDED.current_period_start,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW()`,
    [stripeCustomerId, stripeSubscriptionId, email, plan, 'active', currentPeriodStart, currentPeriodEnd]
  )
}

export async function updateSubscriptionStatus(stripeSubscriptionId: string, status: string) {
  await query(
    'UPDATE wealthforge_subscriptions SET status = $1, updated_at = NOW() WHERE stripe_subscription_id = $2',
    [status, stripeSubscriptionId]
  )
}

export async function getSubscription(email: string) {
  const result = await query('SELECT * FROM wealthforge_subscriptions WHERE email = $1 ORDER BY created_at DESC LIMIT 1', [email])
  return result.rows[0] || null
}

export default pool
