import pool from '@/config/pool';
import { startServer } from '@/infra/http/express/server';

async function bootstrap() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected');

    await startServer();
  } catch (error) {
    console.error('❌ Error starting the app', error);
    process.exit(1);
  }
}

bootstrap();
