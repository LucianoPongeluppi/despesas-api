import { formatDate } from '@/shared/utils/formatDate';

describe('formatDate', () => {
  it('deve formatar uma data ISO válida para YYYY-MM-DD', () => {
    expect(formatDate('2026-05-23T00:00:00.000Z')).toBe('2026-05-23');
  });

  it('deve retornar o valor original para uma string de data inválida', () => {
    expect(formatDate('nao-e-uma-data')).toBe('nao-e-uma-data');
  });

  it('deve formatar uma string de data no formato YYYY-MM-DD', () => {
    const result = formatDate('2026-01-15');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
