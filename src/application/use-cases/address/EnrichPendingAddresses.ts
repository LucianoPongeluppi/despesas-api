import { IAddressService } from '@/application/services/AddressService';
import { AppError } from '@/shared/error/AppError';
import { IAddressRepository } from '@/domain/repositories/IAddressRepository';

const MAX_ENRICHMENT_ATTEMPTS = 3;

export type EnrichPendingAddressesResult = {
  enriched: number;
  failed: number;
  skipped: number;
};

export class EnrichPendingAddresses {
  constructor(
    private addressRepository: IAddressRepository,
    private addressService: IAddressService
  ) {}

  async execute(): Promise<EnrichPendingAddressesResult> {
    const pending = await this.addressRepository.findPendingEnrichment(MAX_ENRICHMENT_ATTEMPTS);

    let enriched = 0;
    let failed = 0;
    let skipped = 0;

    for (const address of pending) {
      if (!address.cep || !address.id) {
        skipped++;
        continue;
      }

      try {
        const data = await this.addressService.getAddressByZipCode(address.cep);

        await this.addressRepository.enrich(address.id, {
          uf: data.state,
          cidade: data.city,
          bairro: data.neighborhood,
          logradouro: data.street,
        });

        enriched++;
      } catch (err) {
        await this.addressRepository.failEnrichment(address.id);

        if (err instanceof AppError && err.statusCode === 404) {
          console.warn(
            `[EnrichPendingAddresses] CEP ${address.cep} não encontrado no ViaCEP. Tentativa ${address.enrichment_attempts + 1}/${MAX_ENRICHMENT_ATTEMPTS}.`
          );
        } else {
          console.error(
            `[EnrichPendingAddresses] Falha ao enriquecer endereço id=${address.id} (CEP ${address.cep}):`,
            err
          );
        }

        failed++;
      }
    }

    return { enriched, failed, skipped };
  }
}
