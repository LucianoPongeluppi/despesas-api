import { PatchExpenseValue } from '@/application/use-cases/expense/PatchExpenseValue';
import { AppError } from '@/shared/error/AppError';
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

describe('PatchExpenseValue', () => {
  let repo: ReturnType<typeof makeExpenseRepository>;
  let useCase: PatchExpenseValue;

  beforeEach(() => {
    repo = makeExpenseRepository();
    useCase = new PatchExpenseValue(repo);
  });

  it('deve atualizar apenas o valor da despesa', async () => {
    const existing = makeExpense();
    const updated = makeExpense({ valor: 250 });
    repo.findById.mockResolvedValue(existing);
    repo.update.mockResolvedValue(updated);

    const result = await useCase.execute('1', { value: 250 });

    expect(result.valor).toBe(250);
    const updatedArg = repo.update.mock.calls[0][1];
    expect(updatedArg.valor).toBe(250);
    expect(updatedArg.descricao).toBe(existing.descricao);
    expect(updatedArg.tipo_pagamento_id).toBe(existing.tipo_pagamento_id);
  });

  it('deve lançar AppError 404 quando a despesa não é encontrada', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('99', { value: 50 })).rejects.toThrow(AppError);
    await expect(useCase.execute('99', { value: 50 })).rejects.toMatchObject({ statusCode: 404 });
    expect(repo.update).not.toHaveBeenCalled();
  });
});
