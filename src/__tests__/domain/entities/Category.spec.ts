import { Category } from '@/domain/entities/Category';

describe('Category', () => {
  it('deve criar uma categoria com todas as propriedades', () => {
    const category = new Category({ id: '1', nome: 'Alimentação', descricao: 'Gastos com alimentação' });
    expect(category.id).toBe('1');
    expect(category.nome).toBe('Alimentação');
    expect(category.descricao).toBe('Gastos com alimentação');
  });

  it('deve definir id como null quando não fornecido', () => {
    const category = new Category({ nome: 'Transporte', descricao: 'Gastos com transporte' });
    expect(category.id).toBeNull();
  });
});
