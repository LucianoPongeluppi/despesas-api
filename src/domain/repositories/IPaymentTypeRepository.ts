import { PaymentType } from '@/domain/entities/PaymentType';

export interface IPaymentTypeRepository {
  create(paymentType: PaymentType): Promise<PaymentType>;
  findAll(): Promise<PaymentType[]>;
  findById(id: string): Promise<PaymentType | null>;
  findByTipo(tipo: string): Promise<PaymentType | null>;
  update(id: string, paymentType: PaymentType): Promise<PaymentType>;
  delete(id: string): Promise<void>;
}
