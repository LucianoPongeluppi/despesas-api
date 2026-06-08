import pool from '@/config/pool';
import { Address } from '@/domain/entities/Address';
import { AddressEnrichmentData, IAddressRepository } from '@/domain/repositories/IAddressRepository';

const SELECT_COLUMNS = 'id, cep, uf, cidade, bairro, logradouro, numero, enriched, enrichment_attempts';

export class AddressRepository implements IAddressRepository {
  async create(address: Address): Promise<Address> {
    const result = await pool.query(
      `INSERT INTO enderecos (cep, uf, cidade, bairro, logradouro, numero, enriched)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${SELECT_COLUMNS}`,
      [
        address.cep,
        address.uf,
        address.cidade,
        address.bairro,
        address.logradouro,
        address.numero,
        address.enriched,
      ]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async findById(id: string): Promise<Address | null> {
    const result = await pool.query(
      `SELECT ${SELECT_COLUMNS} FROM enderecos WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findByCepAndNumber(cep: string, numero: string): Promise<Address | null> {
    const result = await pool.query(
      `SELECT ${SELECT_COLUMNS} FROM enderecos WHERE cep = $1 AND numero = $2 LIMIT 1`,
      [cep, numero]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findPendingEnrichment(maxAttempts: number): Promise<Address[]> {
    const result = await pool.query(
      `SELECT ${SELECT_COLUMNS} FROM enderecos
       WHERE enriched = false AND enrichment_attempts < $1 AND cep IS NOT NULL`,
      [maxAttempts]
    );

    return result.rows.map(this.mapToEntity);
  }

  async enrich(id: string, data: AddressEnrichmentData): Promise<void> {
    await pool.query(
      `UPDATE enderecos
       SET uf = $1, cidade = $2, bairro = $3, logradouro = $4,
           enriched = true, enrichment_attempts = enrichment_attempts + 1
       WHERE id = $5`,
      [data.uf, data.cidade, data.bairro, data.logradouro, id]
    );
  }

  async failEnrichment(id: string): Promise<void> {
    await pool.query(
      'UPDATE enderecos SET enrichment_attempts = enrichment_attempts + 1 WHERE id = $1',
      [id]
    );
  }

  private mapToEntity(address: {
    id: string;
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numero: string;
    enriched: boolean;
    enrichment_attempts: number;
  }): Address {
    return new Address({
      id: address.id,
      cep: address.cep,
      uf: address.uf,
      cidade: address.cidade,
      bairro: address.bairro,
      logradouro: address.logradouro,
      numero: address.numero,
      enriched: address.enriched,
      enrichment_attempts: address.enrichment_attempts,
    });
  }
}
