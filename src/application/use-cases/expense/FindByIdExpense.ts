import { Expense } from '@/domain/entities/Expense';
import { IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { AppError } from '@/shared/error/AppError';

export class FindByIdExpense {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findById(id);

    if (!expense) {
      throw new AppError('Despesa não encontrada', 404);
    }

    return expense;
  }
}
