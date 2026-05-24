import { FindByIdExpense } from '@/application/use-cases/expense/FindByIdExpense';
import { AppError } from '@/shared/error/AppError';
import { Expense } from '@/domain/entities/Expense';
import { makeExpenseRepository } from '@/__tests__/mocks/repositories';

const makeExpense = () =>
  new Expense({
    id: '1',
    valor: 100,
    data_compra: '2026-05-01',
    descricao: 'Despesa teste',
    tipo_pagamento_id: '1',
    categoria_id: '1',
  });

describe('FindByIdExpense', () => {
  let repo: ReturnType<typeof makeExpenseRepository>;
  let useCase: FindByIdExpense;

  beforeEach(() => {
    repo = makeExpenseRepository();
    useCase = new FindByIdExpense(repo);
  });

  it('deve retornar a despesa pelo id', async () => {
    const expense = makeExpense();
    repo.findById.mockResolvedValue(expense);

    const result = await useCase.execute('1');

    expect(result).toEqual(expense);
    expect(repo.findById).toHaveBeenCalledWith('1');
  });

  it('deve lançar AppError 404 quando a despesa não é encontrada', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('99')).rejects.toThrow(AppError);
    await expect(useCase.execute('99')).rejects.toMatchObject({ statusCode: 404 });
  });
});
