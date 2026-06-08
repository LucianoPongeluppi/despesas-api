import pool from '@/config/pool';
import { Address } from '@/domain/entities/Address';
import { Establishment } from '@/domain/entities/Establishment';
import { IEstablishmentRepository } from '@/domain/repositories/IEstablishmentRepository';

type EstablishmentRow = {
  id: string;
  endereco_id: string;
  cep?: string;
  uf?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
};

export class EstablishmentRepository implements IEstablishmentRepository {
  async create(establishment: Establishment): Promise<Establishment> {
    const result = await pool.query(
      'INSERT INTO estabelecimentos (endereco_id) VALUES ($1) RETURNING id, endereco_id',
      [establishment.endereco_id]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async findById(id: string): Promise<Establishment | null> {
    const result = await pool.query(
      'SELECT id, endereco_id FROM estabelecimentos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findByIds(ids: string[]): Promise<Establishment[]> {
    if (ids.length === 0) {
      return [];
    }

    const result = await pool.query(
      'SELECT e.*, en.* FROM estabelecimentos e JOIN enderecos en ON e.endereco_id = en.id WHERE e.id = ANY($1)',
      [ids]
    );

    return result.rows.map(this.mapToEntity);
  }

  async findByAddressId(enderecoId: string): Promise<Establishment | null> {
    const result = await pool.query(
      'SELECT e.*, en.* FROM estabelecimentos e JOIN enderecos en ON e.endereco_id = en.id WHERE e.endereco_id = $1 LIMIT 1',
      [enderecoId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  private mapToEntity(establishment: EstablishmentRow): Establishment {
    const address = establishment.cep
      ? new Address({
        id: establishment.endereco_id,
        cep: establishment.cep,
        uf: establishment.uf,
        cidade: establishment.cidade,
        bairro: establishment.bairro,
        logradouro: establishment.logradouro,
        numero: establishment.numero,
      })
      : null;

    return new Establishment({
      id: establishment.id,
      endereco_id: establishment.endereco_id,
      address,
    });
  }
}
