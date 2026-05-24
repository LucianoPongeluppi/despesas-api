import { Address } from '@/domain/entities/Address';

export interface IAddressRepository {
  create(address: Address): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findByCepAndNumber(cep: string, numero: string): Promise<Address | null>;
}
