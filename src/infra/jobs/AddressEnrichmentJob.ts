import cron from 'node-cron';
import { EnrichPendingAddresses } from '@/application/use-cases/address/EnrichPendingAddresses';

const CRON_SCHEDULE = '*/15 * * * *'; // every 15 minutes

export function startAddressEnrichmentJob(useCase: EnrichPendingAddresses): void {
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log('[AddressEnrichmentJob] Iniciando enriquecimento de endereços pendentes...');

    try {
      const result = await useCase.execute();

      console.log(
        `[AddressEnrichmentJob] Concluído. Enriquecidos: ${result.enriched} | Falhos: ${result.failed} | Ignorados: ${result.skipped}`
      );
    } catch (err) {
      console.error('[AddressEnrichmentJob] Erro inesperado:', err);
    }
  });

  console.log(`✅ AddressEnrichmentJob agendado (${CRON_SCHEDULE})`);
}
