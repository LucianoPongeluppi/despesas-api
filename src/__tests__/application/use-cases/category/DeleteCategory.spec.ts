import { DeleteCategory } from '@/application/use-cases/category/DeleteCategory';
import { AppError } from '@/shared/error/AppError';
import { Category } from '@/domain/entities/Category';
import { makeCategoryRepository, makeExpenseRepository } from '@/__tests__/mocks/repositories';

describe('DeleteCategory', () => {
  let repo: ReturnType<typeof makeCategoryRepository>;
  let expenseRepo: ReturnType<typeof makeExpenseRepository>;
  let useCase: DeleteCategory;

  beforeEach(() => {
    repo = makeCategoryRepository();
    expenseRepo = makeExpenseRepository();
    useCase = new DeleteCategory(repo, expenseRepo);
  });

  it('deve deletar uma categoria existente', async () => {
    repo.findById.mockResolvedValue(new Category({ id: '1', nome: 'Alimentação', descricao: '' }));
    expenseRepo.findAll.mockResolvedValue({ data: [], pagination: { page: 1, limit: 10, pageCount: 0, total: 0 } });
    repo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute('1')).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith('1');
  });

  it('deve lançar AppError 404 quando a categoria não é encontrada', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('99')).rejects.toThrow(AppError);
    await expect(useCase.execute('99')).rejects.toMatchObject({ statusCode: 404 });
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
