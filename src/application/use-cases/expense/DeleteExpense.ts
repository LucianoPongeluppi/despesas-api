import { IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { AppError } from '@/shared/error/AppError';

export class DeleteExpense {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(id: string): Promise<void> {
    const expense = await this.expenseRepository.findById(id);

    if (!expense) {
      throw new AppError('Despesa não encontrada', 404);
    }

    await this.expenseRepository.delete(id);
  }
}
