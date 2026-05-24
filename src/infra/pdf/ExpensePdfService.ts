import puppeteer from 'puppeteer';
import { Expense } from '@/domain/entities/Expense';
import { Establishment } from '@/domain/entities/Establishment';
import { formatDate } from '@/shared/utils/formatDate';
import { IPaymentTypeRepository } from '@/domain/repositories/IPaymentTypeRepository';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { IEstablishmentRepository } from '@/domain/repositories/IEstablishmentRepository';

type ExpenseDataMaps = {
  paymentTypeMap: Map<string | null | undefined, string>;
  categoryMap: Map<string | null | undefined, { nome: string; descricao: string }>;
  establishmentMap: Map<string | null | undefined, Establishment>;
};

export class ExpensePdfService {
  constructor(
    private readonly paymentTypeRepository: IPaymentTypeRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly establishmentRepository: IEstablishmentRepository
  ) {}

  async generate(expenses: Expense[]): Promise<Buffer> {
    const maps = await this.resolveData(expenses);
    const html = this.buildHtml(expenses, maps);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private async resolveData(expenses: Expense[]): Promise<ExpenseDataMaps> {
    const establishmentIds = Array.from(
      new Set(expenses.map((e) => e.estabelecimento_id).filter(Boolean))
    ) as string[];

    const [paymentTypes, categories, establishments] = await Promise.all([
      this.paymentTypeRepository.findAll(),
      this.categoryRepository.findAll(),
      this.establishmentRepository.findByIds(establishmentIds),
    ]);

    return {
      paymentTypeMap: new Map(paymentTypes.map((p) => [p.id, p.tipo])),
      categoryMap: new Map(categories.map((c) => [c.id, { nome: c.nome, descricao: c.descricao }])),
      establishmentMap: new Map(establishments.map((e) => [e.id, e])),
    };
  }

  private buildHtml(expenses: Expense[], maps: ExpenseDataMaps): string {
    const total = expenses.reduce((sum, e) => sum + e.valor, 0);

    const rows = expenses
      .map((expense, i) => {
        const paymentType = maps.paymentTypeMap.get(expense.tipo_pagamento_id) ?? '-';
        const category = maps.categoryMap.get(expense.categoria_id)?.nome ?? '-';
        const bg = i % 2 === 0 ? '#ffffff' : '#f5f7fa';

        return `
          <tr style="background:${bg}">
            <td>${expense.id}</td>
            <td>R$ ${Number(expense.valor).toFixed(2)}</td>
            <td>${formatDate(expense.data_compra)}</td>
            <td>${expense.descricao}</td>
            <td>${paymentType}</td>
            <td>${category}</td>
          </tr>`;
      })
      .join('');

    const emptyRow = `
      <tr>
        <td colspan="6" style="text-align:center; color:#888; padding:20px;">
          Nenhuma despesa no período informado.
        </td>
      </tr>`;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
    h1 { text-align: center; font-size: 18px; margin-bottom: 16px; color: #2F5597; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #2F5597; color: #fff; }
    th { padding: 8px 6px; text-align: left; font-size: 11px; }
    td { padding: 6px; border-bottom: 1px solid #e0e0e0; }
    .total-row { font-weight: bold; text-align: right; padding-top: 12px; font-size: 13px; }
  </style>
</head>
<body>
  <h1>Relatório de Despesas</h1>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Valor</th>
        <th>Data</th>
        <th>Descrição</th>
        <th>Tipo Pagamento</th>
        <th>Categoria</th>
      </tr>
    </thead>
    <tbody>
      ${expenses.length > 0 ? rows : emptyRow}
    </tbody>
  </table>
  ${expenses.length > 0 ? `<p class="total-row">Total: R$ ${total.toFixed(2)}</p>` : ''}
</body>
</html>`;
  }
}
