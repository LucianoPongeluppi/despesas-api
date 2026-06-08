import { Establishment } from '@/domain/entities/Establishment';

export interface IEstablishmentRepository {
  create(establishment: Establishment): Promise<Establishment>;
  findById(id: string): Promise<Establishment | null>;
  findByIds(ids: string[]): Promise<Establishment[]>;
  findByAddressId(enderecoId: string): Promise<Establishment | null>;
}
