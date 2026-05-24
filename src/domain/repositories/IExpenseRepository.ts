import { Expense } from '@/domain/entities/Expense';
import { TPagination } from '@/shared/utils/pagination';

export type ExpenseFilters = {
  page?: number;
  limit?: number;
  categoryId?: string;
  paymentTypeId?: string;
  startDate?: string;
  endDate?: string;
};

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  findAll(filters?: ExpenseFilters): Promise<{ data: Expense[]; pagination: TPagination }>;
  findById(id: string): Promise<Expense | null>;
  update(id: string, expense: Expense): Promise<Expense>;
  delete(id: string): Promise<void>;
}
