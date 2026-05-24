import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { AppError } from '@/shared/error/AppError';

export class DeleteCategory {
  constructor(
    private categoryRepository: ICategoryRepository,
    private expenseRepository: IExpenseRepository
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    const expenses = await this.expenseRepository.findAll({ categoryId: id });

    if (expenses.data.length > 0) {
      throw new AppError('Não é possível excluir uma categoria com despesas associadas', 400);
    }

    await this.categoryRepository.delete(id);
  }
}
