import { Router } from 'express';
import { CreateExpense } from '@/application/use-cases/expense/CreateExpense';
import { ViaCepAddressService } from '@/infra/http/viacep/ViaCepAddressService';
import { AddressRepository } from '@/infra/pool/AddressRepository';
import { ExpenseRepository } from '@/infra/pool/ExpenseRepository';
import { EstablishmentRepository } from '@/infra/pool/EstablishmentRepository';
import { ExpenseController } from '@/infra/http/express/controllers/ExpenseController';
import { validateRequest } from '@/infra/http/express/middlewares/validateRequest';
import { expenseValidations } from './validations/expense.validation';
import { FindAllExpenses } from '@/application/use-cases/expense/FindAllExpenses';
import { FindByIdExpense } from '@/application/use-cases/expense/FindByIdExpense';
import { UpdateExpense } from '@/application/use-cases/expense/UpdateExpense';
import { PatchExpenseValue } from '@/application/use-cases/expense/PatchExpenseValue';
import { DeleteExpense } from '@/application/use-cases/expense/DeleteExpense';
import { ExpensePdfService } from '@/infra/pdf/ExpensePdfService';
import { ExpenseExcelService } from '@/infra/excel/ExpenseExcelService';
import { PaymentTypeRepository } from '@/infra/pool/PaymentTypeRepository';
import { CategoryRepository } from '@/infra/pool/CategoryRepository';

const paymentTypeRepository = new PaymentTypeRepository();
const categoryRepository = new CategoryRepository();
const establishmentRepository = new EstablishmentRepository();

const expenseExcelService = new ExpenseExcelService(paymentTypeRepository, categoryRepository, establishmentRepository);

const expenseRepository = new ExpenseRepository();
const addressService = new ViaCepAddressService();
const addressRepository = new AddressRepository();
const expensePdfService = new ExpensePdfService(paymentTypeRepository, categoryRepository, establishmentRepository);

const expenseController = new ExpenseController(
  new CreateExpense(
    expenseRepository,
    categoryRepository,
    paymentTypeRepository,
    addressService,
    addressRepository,
    establishmentRepository
  ),
  new FindAllExpenses(expenseRepository),
  new FindByIdExpense(expenseRepository),
  new UpdateExpense(
    expenseRepository,
    addressService,
    addressRepository,
    establishmentRepository
  ),
  new PatchExpenseValue(expenseRepository),
  new DeleteExpense(expenseRepository),
  expensePdfService,
  expenseExcelService
);

const router = Router();

router.post('/', validateRequest(expenseValidations.create), (req, res) =>
  expenseController.create(req, res)
);

router.get('/', validateRequest(expenseValidations.findAll), (req, res) =>
  expenseController.findAll(req, res)
);

router.get('/pdf', validateRequest(expenseValidations.exportPdf), (req, res) =>
  expenseController.exportPdf(req, res)
);
router.get('/excel', (req, res) => expenseController.exportExcel(req, res));

router.get('/:id', (req, res) => expenseController.findById(req, res));

router.put('/:id', validateRequest(expenseValidations.update), (req, res) =>
  expenseController.update(req, res)
);

router.patch('/:id', validateRequest(expenseValidations.patch), (req, res) =>
  expenseController.patch(req, res)
);

router.delete('/:id', (req, res) => expenseController.delete(req, res));

export { router as expenseRoutes };
