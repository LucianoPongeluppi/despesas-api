import { CreatePaymentTypeDTO } from '@/application/dtos/PaymentTypeDTO';
import { PaymentType } from '@/domain/entities/PaymentType';
import { IPaymentTypeRepository } from '@/domain/repositories/IPaymentTypeRepository';
import { PaymentTypeVO } from '@/domain/value-objects/PaymentTypeVO';
import { AppError } from '@/shared/error/AppError';

export class CreatePaymentType {
  constructor(private paymentTypeRepository: IPaymentTypeRepository) {}

  async execute(data: CreatePaymentTypeDTO): Promise<PaymentType> {
    const typeVO = new PaymentTypeVO(data.type);

    const existing = await this.paymentTypeRepository.findByTipo(typeVO.getValue());

    if (existing) {
      throw new AppError('Tipo de pagamento já cadastrado', 409);
    }

    const paymentType = new PaymentType({ tipo: typeVO.getValue() });

    return await this.paymentTypeRepository.create(paymentType);
  }
}
