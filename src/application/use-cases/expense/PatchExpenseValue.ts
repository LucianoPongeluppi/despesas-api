import { PatchExpenseValueDTO } from '@/application/dtos/ExpenseDTO';
import { Expense } from '@/domain/entities/Expense';
import { IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { AppError } from '@/shared/error/AppError';

export class PatchExpenseValue {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(id: string, data: PatchExpenseValueDTO): Promise<Expense> {
    const expense = await this.expenseRepository.findById(id);

    if (!expense) {
      throw new AppError('Despesa não encontrada', 404);
    }

    const updatedExpense = new Expense({
      id: expense.id,
      valor: data.value,
      data_compra: expense.data_compra,
      descricao: expense.descricao,
      tipo_pagamento_id: expense.tipo_pagamento_id,
      categoria_id: expense.categoria_id,
      estabelecimento_id: expense.estabelecimento_id,
    });

    return await this.expenseRepository.update(id, updatedExpense);
  }
}
