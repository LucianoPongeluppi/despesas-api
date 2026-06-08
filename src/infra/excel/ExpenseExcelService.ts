import ExcelJS from 'exceljs';
import { Expense } from '@/domain/entities/Expense';
import { IPaymentTypeRepository } from '@/domain/repositories/IPaymentTypeRepository';
import { formatDate } from '@/shared/utils/formatDate';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { IEstablishmentRepository } from '@/domain/repositories/IEstablishmentRepository';

export class ExpenseExcelService {
  private static readonly SHEET_NAME = 'Despesas';

  private static readonly COLUMNS: Partial<ExcelJS.Column>[] = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Valor', key: 'valor', width: 12 },
    { header: 'Data', key: 'data_compra', width: 12 },
    { header: 'Descrição', key: 'descricao', width: 30 },
    { header: 'Tipo Pagamento', key: 'tipo_pagamento', width: 20 },
    { header: 'Categoria', key: 'categoria', width: 20 },
    { header: 'Descrição categoria', key: 'descricao_categoria', width: 40 },
    { header: 'Estabelecimento', key: 'estabelecimento_id', width: 24 },
    { header: 'CEP', key: 'cep', width: 12 },
    { header: 'UF', key: 'uf', width: 8 },
    { header: 'Cidade', key: 'cidade', width: 20 },
    { header: 'Bairro', key: 'bairro', width: 20 },
    { header: 'Logradouro', key: 'logradouro', width: 30 },
    { header: 'Número', key: 'numero', width: 10 },
  ];

  constructor(
    private readonly paymentTypeRepository: IPaymentTypeRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly establishmentRepository: IEstablishmentRepository
  ) {}

  async generate(expenses: Expense[]): Promise<Buffer> {
    if (expenses.length === 0) {
      const workbook = new ExcelJS.Workbook();
      workbook.addWorksheet(ExpenseExcelService.SHEET_NAME).columns = ExpenseExcelService.COLUMNS;
      const buffer = await workbook.xlsx.writeBuffer();

      return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as ArrayBuffer);
    }

    const establishmentIds = Array.from(
      new Set(expenses.map((e) => e.estabelecimento_id).filter(Boolean))
    ) as string[];

    const [categories, paymentTypes] = await Promise.all([
      this.categoryRepository.findAll(),
      this.paymentTypeRepository.findAll(),
    ]);

    const establishments = await this.establishmentRepository.findByIds(establishmentIds);

    const paymentTypeMap = new Map(paymentTypes.map((item) => [item.id, item.tipo]));
    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const establishmentMap = new Map(establishments.map((e) => [e.id, e]));

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(ExpenseExcelService.SHEET_NAME);

    sheet.columns = ExpenseExcelService.COLUMNS;

    for (const expense of expenses) {
      const cat = categoryMap.get(expense.categoria_id);
      const est = establishmentMap.get(expense.estabelecimento_id ?? '');

      sheet.addRow({
        id: expense.id ?? '',
        valor: expense.valor,
        data_compra: formatDate(expense.data_compra),
        descricao: expense.descricao,
        tipo_pagamento: paymentTypeMap.get(expense.tipo_pagamento_id),
        categoria: cat?.nome || '',
        descricao_categoria: cat?.descricao || '',
        estabelecimento_id: expense.estabelecimento_id,
        cep: est?.address?.cep || '',
        uf: est?.address?.uf || '',
        cidade: est?.address?.cidade || '',
        bairro: est?.address?.bairro || '',
        logradouro: est?.address?.logradouro || '',
        numero: est?.address?.numero || '',
      });
    }

    this.styleHeaderRow(sheet);

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as ArrayBuffer);
  }

  private styleHeaderRow(sheet: ExcelJS.Worksheet): void {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };
    headerRow.alignment = { horizontal: 'center' };
    headerRow.border = {
      bottom: { style: 'thin', color: { argb: 'FF4472C4' } },
    };
  }
}
