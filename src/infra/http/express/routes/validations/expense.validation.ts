import { z } from 'zod';

const zipCodeSchema = z
  .string()
  .min(8, 'CEP é obrigatório')
  .regex(/^\d{5}-?\d{3}$/, 'CEP inválido');

const addressNumberSchema = z.string().min(1, 'Número é obrigatório');

const createExpenseSchema = z.object({
  body: z.object({
    value: z.number().min(1, 'Valor é obrigatório'),
    purchaseDate: z.string().min(1, 'Data da compra é obrigatória'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    paymentTypeId: z.string().min(1, 'Tipo de pagamento é obrigatório'),
    categoryId: z.string().min(1, 'Categoria é obrigatória'),
    zipCode: zipCodeSchema,
    addressNumber: addressNumberSchema,
  })
});

const updateExpenseBodySchema = z
  .object({
    value: z.number().optional(),
    purchaseDate: z.string().optional(),
    description: z.string().optional(),
    paymentTypeId: z.string().optional(),
    categoryId: z.string().optional(),
    zipCode: zipCodeSchema.optional(),
    addressNumber: addressNumberSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.zipCode && !data.addressNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['addressNumber'],
        message: 'Número é obrigatório quando o CEP é informado',
      });
    }

    if (data.addressNumber && !data.zipCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['zipCode'],
        message: 'CEP é obrigatório quando o número é informado',
      });
    }
  });

const updateExpenseSchema = z.object({
  body: updateExpenseBodySchema,
});

const patchExpenseSchema = z.object({
  body: z.object({
    value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  }),
});

const findAllExpensesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  })
});

const exportPdfSchema = z.object({
  query: z
    .object({
      startDate: z.string().min(1, 'Data inicial é obrigatória'), // yyyy-mm-dd
      endDate: z.string().min(1, 'Data final é obrigatória'), // yyyy-mm-dd
    }).refine((data) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      return dateRegex.test(data.startDate) && dateRegex.test(data.endDate);
    })
    .refine((data) => {
      const start = Date.parse(data.startDate);
      const end = Date.parse(data.endDate);

      return !Number.isNaN(start) && !Number.isNaN(end) && start <= end;
    }, {
      message: 'Intervalo de datas inválido',
      path: ['endDate'],
    }),
});

export const expenseValidations = {
  create: createExpenseSchema,
  update: updateExpenseSchema,
  patch: patchExpenseSchema,
  findAll: findAllExpensesSchema,
  exportPdf: exportPdfSchema,
};
