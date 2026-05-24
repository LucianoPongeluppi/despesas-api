import { AppError } from '@/shared/error/AppError';

export const VALID_PAYMENT_TYPES = ['Dinheiro', 'Débito', 'Crédito', 'Pix'] as const;

export type PaymentTypeValue = (typeof VALID_PAYMENT_TYPES)[number];

export class PaymentTypeVO {
  private readonly value: PaymentTypeValue;

  constructor(value: string) {
    this.validate(value);
    this.value = value as PaymentTypeValue;
  }

  private validate(value: string): void {
    const validPaymentTypes: readonly string[] = VALID_PAYMENT_TYPES;

    if (!validPaymentTypes.includes(value)) {
      throw new AppError(`Tipo de pagamento inválido: ${value}`);
    }
  }

  public getValue(): string {
    return this.value;
  }
}
