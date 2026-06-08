import pool from '@/config/pool';
import { Expense } from '@/domain/entities/Expense';
import { ExpenseFilters, IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { TPagination } from '@/shared/utils/pagination';

export class ExpenseRepository implements IExpenseRepository {
  async create(expense: Expense): Promise<Expense> {
    const result = await pool.query(
      'INSERT INTO despesas (valor, data_compra, descricao, tipo_pagamento_id, categoria_id, estabelecimento_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, valor, data_compra, descricao, tipo_pagamento_id, categoria_id, estabelecimento_id',
      [
        expense.valor,
        expense.data_compra,
        expense.descricao,
        expense.tipo_pagamento_id,
        expense.categoria_id,
        expense.estabelecimento_id,
      ]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async findAll(filters: ExpenseFilters = {}): Promise<{ data: Expense[]; pagination: TPagination }> {
    const { page, limit, startDate, endDate, categoryId, paymentTypeId } = filters;

    const hasDateRange = typeof startDate === 'string' && typeof endDate === 'string';
    const hasPagination = typeof page === 'number' && typeof limit === 'number';

    const whereClauses = [];

    if (hasDateRange) {
      whereClauses.push('data_compra::date >= $1::date AND data_compra::date <= $2::date');
    }

    const baseParams: Array<string | number> = hasDateRange ? [startDate, endDate] : [];

    if (categoryId) {
      whereClauses.push(`categoria_id = $${baseParams.length + 1}`);
      baseParams.push(categoryId);
    }

    if (paymentTypeId) {
      whereClauses.push(`tipo_pagamento_id = $${baseParams.length + 1}`);
      baseParams.push(paymentTypeId);
    }

    const whereClause = whereClauses.length > 0 ? whereClauses.join(' AND ') : '1=1';

    const { rows: [{ count }] } = await pool.query(
      `SELECT COUNT(*) FROM despesas WHERE ${whereClause}`,
      baseParams
    );
    const total = parseInt(count, 10);

    const resolvedPage = typeof page === 'number' ? page : 1;
    const resolvedLimit = typeof limit === 'number' ? limit : total;

    const dataParams: Array<string | number> = [...baseParams];

    let dataQuery = `
      SELECT d.id, d.valor, d.data_compra, d.descricao, e.id AS estabelecimento_id, en.id AS endereco_id, en.cep, en.logradouro
      FROM despesas d
      LEFT JOIN estabelecimentos e ON d.estabelecimento_id = e.id
      LEFT JOIN enderecos en ON e.endereco_id = en.id
      WHERE ${whereClause}
      ORDER BY d.data_compra DESC, d.id DESC
    `;

    if (hasPagination) {
      const offset = baseParams.length;
      dataQuery += ` LIMIT $${offset + 1} OFFSET $${offset + 2}`;
      dataParams.push(resolvedLimit, (resolvedPage - 1) * resolvedLimit);
    }

    const { rows } = await pool.query(dataQuery, dataParams);

    return {
      data: rows.map(this.mapToEntity),
      pagination: {
        page: resolvedPage,
        limit: resolvedLimit,
        pageCount: resolvedLimit > 0 ? Math.ceil(total / resolvedLimit) : 1,
        total,
      },
    };
  }

  async findById(id: string): Promise<Expense | null> {
    const result = await pool.query(
      'SELECT id, valor, data_compra, descricao, tipo_pagamento_id, categoria_id, estabelecimento_id FROM despesas WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async update(id: string, expense: Expense): Promise<Expense> {
    const result = await pool.query(
      'UPDATE despesas SET valor = $1, data_compra = $2, descricao = $3, tipo_pagamento_id = $4, categoria_id = $5, estabelecimento_id = $6 WHERE id = $7 RETURNING id, valor, data_compra, descricao, tipo_pagamento_id, categoria_id, estabelecimento_id',
      [
        expense.valor,
        expense.data_compra,
        expense.descricao,
        expense.tipo_pagamento_id,
        expense.categoria_id,
        expense.estabelecimento_id,
        id,
      ]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM despesas WHERE id = $1', [id]);
  }

  private mapToEntity(expense: {
    id: string;
    valor: string;
    data_compra: string;
    descricao: string;
    tipo_pagamento_id: string;
    categoria_id: string;
    estabelecimento_id?: string | null;
  }): Expense {
    const estabelecimento = expense.estabelecimento_id
      ? {
        id: expense.estabelecimento_id,
      } : null;

    return new Expense({
      id: expense.id,
      valor: parseFloat(expense.valor),
      data_compra: expense.data_compra,
      descricao: expense.descricao,
      tipo_pagamento_id: expense.tipo_pagamento_id,
      categoria_id: expense.categoria_id,
      estabelecimento_id: expense.estabelecimento_id ?? null,
      estabelecimento,
    });
  }
}
