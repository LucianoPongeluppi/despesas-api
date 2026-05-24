import { Request, Response } from 'express';
import { CreatePaymentType } from '@/application/use-cases/payment-type/CreatePaymentType';
import { DeletePaymentType } from '@/application/use-cases/payment-type/DeletePaymentType';
import { FindAllPaymentTypes } from '@/application/use-cases/payment-type/FindAllPaymentTypes';
import { getParamsId } from '../utils/getParamsId';

export class PaymentTypeController {
  constructor(
    private createPaymentType: CreatePaymentType,
    private findAllPaymentTypes: FindAllPaymentTypes,
    private deletePaymentType: DeletePaymentType
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    const paymentType = await this.createPaymentType.execute(req.body);

    return res.status(201).json({
      data: paymentType,
      success: true,
    });
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const paymentTypes = await this.findAllPaymentTypes.execute();

    return res.json({
      data: paymentTypes,
      success: true,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = getParamsId(req);

    await this.deletePaymentType.execute(id);

    return res.status(200).json({
      data: null,
      success: true,
    });
  }
}
