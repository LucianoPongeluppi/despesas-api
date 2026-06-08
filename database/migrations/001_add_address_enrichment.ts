import 'dotenv/config';
import { Pool } from 'pg';
import { env } from '../../src/config/env';

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Running migration: 001_add_address_enrichment...');

    await client.query(`
      ALTER TABLE enderecos
        ADD COLUMN IF NOT EXISTS enriched boolean NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS enrichment_attempts integer NOT NULL DEFAULT 0;
    `);

    console.log('Migration complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
