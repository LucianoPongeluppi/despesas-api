import { Expense } from '@/domain/entities/Expense';

describe('Expense', () => {
  const baseProps = {
    valor: 150.5,
    data_compra: '2026-05-01',
    descricao: 'Almoço',
    tipo_pagamento_id: '1',
    categoria_id: '2',
  };

  it('deve criar uma despesa com todas as propriedades', () => {
    const expense = new Expense({ ...baseProps, id: '10', estabelecimento_id: '5' });
    expect(expense.id).toBe('10');
    expect(expense.valor).toBe(150.5);
    expect(expense.data_compra).toBe('2026-05-01');
    expect(expense.descricao).toBe('Almoço');
    expect(expense.tipo_pagamento_id).toBe('1');
    expect(expense.categoria_id).toBe('2');
    expect(expense.estabelecimento_id).toBe('5');
  });

  it('deve definir id como null quando não fornecido', () => {
    const expense = new Expense(baseProps);
    expect(expense.id).toBeNull();
  });

  it('deve definir estabelecimento_id como null quando não fornecido', () => {
    const expense = new Expense(baseProps);
    expect(expense.estabelecimento_id).toBeNull();
  });

  it('deve aceitar estabelecimento_id explicitamente nulo', () => {
    const expense = new Expense({ ...baseProps, estabelecimento_id: null });
    expect(expense.estabelecimento_id).toBeNull();
  });
});
