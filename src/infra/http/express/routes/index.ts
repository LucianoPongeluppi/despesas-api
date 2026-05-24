import { Router } from 'express';
import { categoryRoutes } from './categoryRoutes';
import { expenseRoutes } from './expenseRoutes';
import { paymentTypeRoutes } from './paymentTypeRoutes';

const router = Router();

router.use('/categorias', categoryRoutes);
router.use('/despesas', expenseRoutes);
router.use('/tipos-de-pagamento', paymentTypeRoutes);

export { router };
