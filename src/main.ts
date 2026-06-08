import pool from '@/config/pool';
import { startServer } from '@/infra/http/express/server';
import { startAddressEnrichmentJob } from '@/infra/jobs/AddressEnrichmentJob';
import { EnrichPendingAddresses } from '@/application/use-cases/address/EnrichPendingAddresses';
import { AddressRepository } from '@/infra/pool/AddressRepository';
import { ViaCepAddressService } from '@/infra/http/viacep/ViaCepAddressService';

async function bootstrap() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected');

    await startServer();

    const enrichPendingAddresses = new EnrichPendingAddresses(
      new AddressRepository(),
      new ViaCepAddressService()
    );
    startAddressEnrichmentJob(enrichPendingAddresses);
  } catch (error) {
    console.error('❌ Error starting the app', error);
    process.exit(1);
  }
}

bootstrap();
