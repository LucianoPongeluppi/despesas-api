import { PaymentTypeVO, VALID_PAYMENT_TYPES } from '@/domain/value-objects/PaymentTypeVO';
import { AppError } from '@/shared/error/AppError';

describe('PaymentTypeVO', () => {
  it.each(VALID_PAYMENT_TYPES)('deve aceitar o tipo válido "%s"', (tipo) => {
    expect(() => new PaymentTypeVO(tipo)).not.toThrow();
  });

  it('deve retornar o valor via getValue()', () => {
    const vo = new PaymentTypeVO('Pix');
    expect(vo.getValue()).toBe('Pix');
  });

  it('deve lançar AppError para tipo inválido', () => {
    expect(() => new PaymentTypeVO('BolBoleto')).toThrow(AppError);
  });

  it('deve incluir o valor inválido na mensagem de erro', () => {
    expect(() => new PaymentTypeVO('CartaoVirtual')).toThrow(
      'Tipo de pagamento inválido: CartaoVirtual',
    );
  });

  it('deve lançar AppError com statusCode 400 para tipo inválido', () => {
    try {
      new PaymentTypeVO('inválido');
      fail('Deveria ter lançado AppError');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(400);
    }
  });
});
