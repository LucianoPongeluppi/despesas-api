import { PaymentType } from '@/domain/entities/PaymentType';

describe('PaymentType', () => {
  it('deve criar um tipo de pagamento com todas as propriedades', () => {
    const paymentType = new PaymentType({ id: '1', tipo: 'Pix' });
    expect(paymentType.id).toBe('1');
    expect(paymentType.tipo).toBe('Pix');
  });

  it('deve definir id como null quando não fornecido', () => {
    const paymentType = new PaymentType({ tipo: 'Crédito' });
    expect(paymentType.id).toBeNull();
  });
});
