import { z } from 'zod';
import { VALID_PAYMENT_TYPES } from '@/domain/value-objects/PaymentTypeVO';

const paymentTypeEnum = z.enum(VALID_PAYMENT_TYPES, {
  message: `Tipo de pagamento inválido. Valores aceitos: ${VALID_PAYMENT_TYPES.join(', ')}`,
});

const createPaymentTypeSchema = z.object({
  body: z.object({
    type: paymentTypeEnum,
  })
});

export const paymentTypeValidations = {
  create: createPaymentTypeSchema,
};
