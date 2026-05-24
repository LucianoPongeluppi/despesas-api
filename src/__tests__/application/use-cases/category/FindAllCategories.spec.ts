import { FindAllCategories } from '@/application/use-cases/category/FindAllCategories';
import { Category } from '@/domain/entities/Category';
import { makeCategoryRepository } from '@/__tests__/mocks/repositories';

describe('FindAllCategories', () => {
  let repo: ReturnType<typeof makeCategoryRepository>;
  let useCase: FindAllCategories;

  beforeEach(() => {
    repo = makeCategoryRepository();
    useCase = new FindAllCategories(repo);
  });

  it('deve retornar todas as categorias', async () => {
    const categories = [
      new Category({ id: '1', nome: 'Alimentação', descricao: 'Gastos com alimentação' }),
      new Category({ id: '2', nome: 'Transporte', descricao: 'Gastos com transporte' }),
    ];
    repo.findAll.mockResolvedValue(categories);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].nome).toBe('Alimentação');
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar array vazio quando não há categorias', async () => {
    repo.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });
});
