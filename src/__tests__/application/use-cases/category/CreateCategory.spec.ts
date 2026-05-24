import { CreateCategory } from '@/application/use-cases/category/CreateCategory';
import { Category } from '@/domain/entities/Category';
import { makeCategoryRepository } from '@/__tests__/mocks/repositories';

describe('CreateCategory', () => {
  let repo: ReturnType<typeof makeCategoryRepository>;
  let useCase: CreateCategory;

  beforeEach(() => {
    repo = makeCategoryRepository();
    useCase = new CreateCategory(repo);
  });

  it('deve criar uma categoria com os dados informados', async () => {
    const created = new Category({ id: '1', nome: 'Alimentação', descricao: 'Gastos com alimentação' });
    repo.create.mockResolvedValue(created);

    const result = await useCase.execute({ name: 'Alimentação', description: 'Gastos com alimentação' });

    expect(repo.create).toHaveBeenCalledTimes(1);
    const calledWith = repo.create.mock.calls[0][0];
    expect(calledWith.nome).toBe('Alimentação');
    expect(calledWith.descricao).toBe('Gastos com alimentação');
    expect(result.id).toBe('1');
  });
});
