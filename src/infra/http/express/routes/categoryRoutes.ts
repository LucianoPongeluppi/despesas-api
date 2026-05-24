import { Router } from 'express';
import { CreateCategory } from '@/application/use-cases/category/CreateCategory';
import { CategoryRepository } from '@/infra/pool/CategoryRepository';
import { CategoryController } from '@/infra/http/express/controllers/CategoryController';
import { validateRequest } from '@/infra/http/express/middlewares/validateRequest';
import { categoryValidations } from './validations/category.validation';
import { FindAllCategories } from '@/application/use-cases/category/FindAllCategories';
import { DeleteCategory } from '@/application/use-cases/category/DeleteCategory';
import { ExpenseRepository } from '@/infra/pool/ExpenseRepository';

const categoryRepository = new CategoryRepository();
const expenseRepository = new ExpenseRepository();

const categoryController = new CategoryController(
  new CreateCategory(categoryRepository),
  new FindAllCategories(categoryRepository),
  new DeleteCategory(categoryRepository, expenseRepository)
);

const router = Router();

router.post('/', validateRequest(categoryValidations.create), (req, res) =>
  categoryController.create(req, res)
);

router.get('/', (req, res) => categoryController.findAll(req, res));

router.delete('/:id', (req, res) => categoryController.delete(req, res));

export { router as categoryRoutes };
