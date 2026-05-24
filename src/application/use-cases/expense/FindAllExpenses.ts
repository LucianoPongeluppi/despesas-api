import { Expense } from '@/domain/entities/Expense';
import { ExpenseFilters, IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { TPagination } from '@/shared/utils/pagination';

export class FindAllExpenses {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(filters?: ExpenseFilters): Promise<{ data: Expense[]; pagination: TPagination }> {
    return await this.expenseRepository.findAll(filters);
  }
}
