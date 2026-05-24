import { Establishment } from '@/domain/entities/Establishment';

export interface IEstablishmentRepository {
  create(establishment: Establishment): Promise<Establishment>;
  findById(id: string): Promise<Establishment | null>;
  findByIds(ids: string[]): Promise<Establishment[]>;
  findByEnderecoId(enderecoId: string): Promise<Establishment | null>;
}
