import { Router } from 'express';
import { CreatePaymentType } from '@/application/use-cases/payment-type/CreatePaymentType';
import { PaymentTypeRepository } from '@/infra/pool/PaymentTypeRepository';
import { PaymentTypeController } from '@/infra/http/express/controllers/PaymentTypeController';
import { validateRequest } from '@/infra/http/express/middlewares/validateRequest';
import { paymentTypeValidations } from './validations/payment-type.validation';
import { FindAllPaymentTypes } from '@/application/use-cases/payment-type/FindAllPaymentTypes';
import { DeletePaymentType } from '@/application/use-cases/payment-type/DeletePaymentType';

const paymentTypeRepository = new PaymentTypeRepository();

const paymentTypeController = new PaymentTypeController(
  new CreatePaymentType(paymentTypeRepository),
  new FindAllPaymentTypes(paymentTypeRepository),
  new DeletePaymentType(paymentTypeRepository)
);

const router = Router();

router.post('/', validateRequest(paymentTypeValidations.create), (req, res) =>
  paymentTypeController.create(req, res)
);

router.get('/', (req, res) => paymentTypeController.findAll(req, res));

router.delete('/:id', (req, res) => paymentTypeController.delete(req, res));

export { router as paymentTypeRoutes };
