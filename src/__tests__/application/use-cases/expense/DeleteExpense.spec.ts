import { DeleteExpense } from '@/application/use-cases/expense/DeleteExpense';
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

describe('DeleteExpense', () => {
  let repo: ReturnType<typeof makeExpenseRepository>;
  let useCase: DeleteExpense;

  beforeEach(() => {
    repo = makeExpenseRepository();
    useCase = new DeleteExpense(repo);
  });

  it('deve deletar a despesa existente', async () => {
    repo.findById.mockResolvedValue(makeExpense());
    repo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute('1')).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith('1');
  });

  it('deve lançar AppError 404 quando a despesa não é encontrada', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('99')).rejects.toThrow(AppError);
    await expect(useCase.execute('99')).rejects.toMatchObject({ statusCode: 404 });
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
