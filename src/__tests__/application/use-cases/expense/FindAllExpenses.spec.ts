import { FindAllExpenses } from '@/application/use-cases/expense/FindAllExpenses';
import { Expense } from '@/domain/entities/Expense';
import { makeExpenseRepository } from '@/__tests__/mocks/repositories';

const makeExpense = (overrides = {}) =>
  new Expense({
    id: '1',
    valor: 100,
    data_compra: '2026-05-01',
    descricao: 'Despesa teste',
    tipo_pagamento_id: '1',
    categoria_id: '1',
    ...overrides,
  });

describe('FindAllExpenses', () => {
  let repo: ReturnType<typeof makeExpenseRepository>;
  let useCase: FindAllExpenses;

  beforeEach(() => {
    repo = makeExpenseRepository();
    useCase = new FindAllExpenses(repo);
  });

  it('deve retornar despesas com paginação', async () => {
    const pagination = { page: 1, limit: 10, pageCount: 1, total: 1 };
    repo.findAll.mockResolvedValue({ data: [makeExpense()], pagination });

    const result = await useCase.execute();

    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
    expect(repo.findAll).toHaveBeenCalledWith(undefined);
  });

  it('deve repassar os filtros ao repositório', async () => {
    const filters = { page: 2, limit: 5, startDate: '2026-05-01', endDate: '2026-05-31' };
    repo.findAll.mockResolvedValue({ data: [], pagination: { page: 2, limit: 5, pageCount: 0, total: 0 } });

    await useCase.execute(filters);

    expect(repo.findAll).toHaveBeenCalledWith(filters);
  });
});
