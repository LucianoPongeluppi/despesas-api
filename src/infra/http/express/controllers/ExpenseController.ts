import { Request, Response } from 'express';
import { CreateExpense } from '@/application/use-cases/expense/CreateExpense';
import { DeleteExpense } from '@/application/use-cases/expense/DeleteExpense';
import { FindAllExpenses } from '@/application/use-cases/expense/FindAllExpenses';
import { FindByIdExpense } from '@/application/use-cases/expense/FindByIdExpense';
import { UpdateExpense } from '@/application/use-cases/expense/UpdateExpense';
import { PatchExpenseValue } from '@/application/use-cases/expense/PatchExpenseValue';
import { ExpenseExcelService } from '@/infra/excel/ExpenseExcelService';
import { ExpensePdfService } from '@/infra/pdf/ExpensePdfService';
import { getParamsId } from '../utils/getParamsId';

export class ExpenseController {
  constructor(
    private createExpense: CreateExpense,
    private findAllExpenses: FindAllExpenses,
    private findByIdExpense: FindByIdExpense,
    private updateExpense: UpdateExpense,
    private patchExpenseValue: PatchExpenseValue,
    private deleteExpense: DeleteExpense,
    private expensePdfService: ExpensePdfService,
    private expenseExcelService: ExpenseExcelService
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    const expense = await this.createExpense.execute(req.body);

    return res.status(201).json({
      data: { id: expense.id },
      success: true,
    });
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const { page, limit, startDate, endDate } = req.query;

    const filters: Record<string, unknown> = {};
    if (typeof page === 'string') filters.page = Number(page);
    if (typeof limit === 'string') filters.limit = Number(limit);
    if (typeof startDate === 'string') filters.startDate = startDate;
    if (typeof endDate === 'string') filters.endDate = endDate;

    const { data, pagination } = await this.findAllExpenses.execute(
      Object.keys(filters).length > 0 ? filters : undefined
    );

    return res.json({
      data,
      pagination,
      success: true,
    });
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const id = getParamsId(req);

    const expense = await this.findByIdExpense.execute(id);

    return res.json({
      data: expense,
      success: true,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = getParamsId(req);

    const expense = await this.updateExpense.execute(id, req.body);

    return res.json({
      data: expense,
      success: true,
    });
  }

  async patch(req: Request, res: Response): Promise<Response> {
    const id = getParamsId(req);

    const expense = await this.patchExpenseValue.execute(id, req.body);

    return res.json({
      data: expense,
      success: true,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = getParamsId(req);

    await this.deleteExpense.execute(id);

    return res.status(200).json({
      data: null,
      success: true,
    });
  }

  async exportPdf(req: Request, res: Response): Promise<Response> {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };

    const { data: expenses } = await this.findAllExpenses.execute({ startDate, endDate });
    const pdfBuffer = await this.expensePdfService.generate(expenses);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="despesas-${startDate}-a-${endDate}.pdf"`
    );

    return res.status(200).send(pdfBuffer);
  }

  async exportExcel(req: Request, res: Response): Promise<Response> {
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

    const { data: expenses } = await this.findAllExpenses.execute({ startDate, endDate });

    const excelBuffer = await this.expenseExcelService.generate(expenses);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename="despesas-mes-vigente.xlsx"');

    return res.status(200).send(excelBuffer);
  }
}
