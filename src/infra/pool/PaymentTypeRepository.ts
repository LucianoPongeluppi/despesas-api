import pool from '@/config/pool';

import { PaymentType } from '@/domain/entities/PaymentType';
import { IPaymentTypeRepository } from '@/domain/repositories/IPaymentTypeRepository';

export class PaymentTypeRepository implements IPaymentTypeRepository {
  async create(paymentType: PaymentType): Promise<PaymentType> {
    const result = await pool.query(
      'INSERT INTO tipos_pagamento (tipo) VALUES ($1) RETURNING id, tipo',
      [paymentType.tipo]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async findAll(): Promise<PaymentType[]> {
    const result = await pool.query('SELECT id, tipo FROM tipos_pagamento');
    return result.rows.map(this.mapToEntity);
  }

  async findById(id: string): Promise<PaymentType | null> {
    const result = await pool.query('SELECT id, tipo FROM tipos_pagamento WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findByTipo(tipo: string): Promise<PaymentType | null> {
    const result = await pool.query('SELECT id, tipo FROM tipos_pagamento WHERE LOWER(tipo) = LOWER($1)', [tipo]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async update(id: string, paymentType: PaymentType): Promise<PaymentType> {
    const result = await pool.query(
      'UPDATE tipos_pagamento SET tipo = $1 WHERE id = $2 RETURNING id, tipo',
      [paymentType.tipo, id]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM tipos_pagamento WHERE id = $1', [id]);
  }

  private mapToEntity(paymentType: { id: string; tipo: string }): PaymentType {
    return new PaymentType({
      id: paymentType.id,
      tipo: paymentType.tipo,
    });
  }
}
