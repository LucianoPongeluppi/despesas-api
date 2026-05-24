import { z } from 'zod';

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
  })
});

export const categoryValidations = {
  create: createCategorySchema,
};
