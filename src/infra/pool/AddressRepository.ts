import pool from '@/config/pool';
import { Address } from '@/domain/entities/Address';
import { IAddressRepository } from '@/domain/repositories/IAddressRepository';

export class AddressRepository implements IAddressRepository {
  async create(address: Address): Promise<Address> {
    const result = await pool.query(
      'INSERT INTO enderecos (cep, uf, cidade, bairro, logradouro, numero) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, cep, uf, cidade, bairro, logradouro, numero',
      [
        address.cep,
        address.uf,
        address.cidade,
        address.bairro,
        address.logradouro,
        address.numero,
      ]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async findById(id: string): Promise<Address | null> {
    const result = await pool.query(
      'SELECT id, cep, uf, cidade, bairro, logradouro, numero FROM enderecos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findByCepAndNumber(cep: string, numero: string): Promise<Address | null> {
    const result = await pool.query(
      'SELECT id, cep, uf, cidade, bairro, logradouro, numero FROM enderecos WHERE cep = $1 AND numero = $2 LIMIT 1',
      [cep, numero]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  private mapToEntity(address: {
    id: string;
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numero: string;
  }): Address {
    return new Address({
      id: address.id,
      cep: address.cep,
      uf: address.uf,
      cidade: address.cidade,
      bairro: address.bairro,
      logradouro: address.logradouro,
      numero: address.numero,
    });
  }
}
