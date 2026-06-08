import { Address } from '@/domain/entities/Address';

export type AddressEnrichmentData = {
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
};

export interface IAddressRepository {
  create(address: Address): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findByCepAndNumber(cep: string, numero: string): Promise<Address | null>;
  findPendingEnrichment(maxAttempts: number): Promise<Address[]>;
  enrich(id: string, data: AddressEnrichmentData): Promise<void>;
  failEnrichment(id: string): Promise<void>;
}
