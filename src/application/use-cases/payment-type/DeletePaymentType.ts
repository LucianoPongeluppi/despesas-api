import { IPaymentTypeRepository } from '@/domain/repositories/IPaymentTypeRepository';
import { AppError } from '@/shared/error/AppError';

export class DeletePaymentType {
  constructor(private paymentTypeRepository: IPaymentTypeRepository) {}

  async execute(id: string): Promise<void> {
    const paymentType = await this.paymentTypeRepository.findById(id);

    if (!paymentType) {
      throw new AppError('Tipo de pagamento não encontrado', 404);
    }

    await this.paymentTypeRepository.delete(id);
  }
}
