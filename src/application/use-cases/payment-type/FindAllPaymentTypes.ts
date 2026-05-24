import { PaymentType } from '@/domain/entities/PaymentType';
import { IPaymentTypeRepository } from '@/domain/repositories/IPaymentTypeRepository';

export class FindAllPaymentTypes {
  constructor(private paymentTypeRepository: IPaymentTypeRepository) {}

  async execute(): Promise<PaymentType[]> {
    return await this.paymentTypeRepository.findAll();
  }
}
