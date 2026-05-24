import { CreateExpense } from '@/application/use-cases/expense/CreateExpense';
import { Expense } from '@/domain/entities/Expense';
import { Address } from '@/domain/entities/Address';
import { Establishment } from '@/domain/entities/Establishment';
import { Category } from '@/domain/entities/Category';
import { PaymentType } from '@/domain/entities/PaymentType';
import {
  makeExpenseRepository,
  makeAddressRepository,
  makeEstablishmentRepository,
  makeAddressService,
  makeCategoryRepository,
  makePaymentTypeRepository,
} from '@/__tests__/mocks/repositories';

const mockAddressData = {
  zipCode: '01310100',
  street: 'Av. Paulista',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
};

const mockAddress = new Address({
  id: '10',
  cep: '01310100',
  uf: 'SP',
  cidade: 'São Paulo',
  bairro: 'Bela Vista',
  logradouro: 'Av. Paulista',
  numero: '1000',
});

const mockEstablishment = new Establishment({ id: '20', endereco_id: '10' });

const makeCreateDTO = () => ({
  value: 150,
  purchaseDate: '2026-05-01',
  description: 'Almoço',
  paymentTypeId: '1',
  categoryId: '2',
  zipCode: '01310100',
  addressNumber: '1000',
});

describe('CreateExpense', () => {
  let expenseRepo: ReturnType<typeof makeExpenseRepository>;
  let categoryRepo: ReturnType<typeof makeCategoryRepository>;
  let paymentTypeRepo: ReturnType<typeof makePaymentTypeRepository>;
  let addressRepo: ReturnType<typeof makeAddressRepository>;
  let establishmentRepo: ReturnType<typeof makeEstablishmentRepository>;
  let addressService: ReturnType<typeof makeAddressService>;
  let useCase: CreateExpense;

  beforeEach(() => {
    expenseRepo = makeExpenseRepository();
    categoryRepo = makeCategoryRepository();
    paymentTypeRepo = makePaymentTypeRepository();
    addressRepo = makeAddressRepository();
    establishmentRepo = makeEstablishmentRepository();
    addressService = makeAddressService();
    useCase = new CreateExpense(expenseRepo, categoryRepo, paymentTypeRepo, addressService, addressRepo, establishmentRepo);

    categoryRepo.findById.mockResolvedValue(new Category({ id: '2', nome: 'Alimentação', descricao: '' }));
    paymentTypeRepo.findById.mockResolvedValue(new PaymentType({ id: '1', tipo: 'Cartão' }));
  });

  it('deve criar despesa criando novo endereço e novo estabelecimento', async () => {
    const createdExpense = new Expense({ id: '1', valor: 150, data_compra: '2026-05-01', descricao: 'Almoço', tipo_pagamento_id: '1', categoria_id: '2', estabelecimento_id: '20' });
    addressService.getAddressByZipCode.mockResolvedValue(mockAddressData);
    addressRepo.findByCepAndNumber.mockResolvedValue(null);
    addressRepo.create.mockResolvedValue(mockAddress);
    establishmentRepo.findByEnderecoId.mockResolvedValue(null);
    establishmentRepo.create.mockResolvedValue(mockEstablishment);
    expenseRepo.create.mockResolvedValue(createdExpense);

    const result = await useCase.execute(makeCreateDTO());

    expect(addressRepo.create).toHaveBeenCalledTimes(1);
    expect(establishmentRepo.create).toHaveBeenCalledTimes(1);
    expect(expenseRepo.create).toHaveBeenCalledTimes(1);
    expect(result.estabelecimento_id).toBe('20');
  });

  it('deve reutilizar endereço existente', async () => {
    addressService.getAddressByZipCode.mockResolvedValue(mockAddressData);
    addressRepo.findByCepAndNumber.mockResolvedValue(mockAddress);
    establishmentRepo.findByEnderecoId.mockResolvedValue(null);
    establishmentRepo.create.mockResolvedValue(mockEstablishment);
    expenseRepo.create.mockResolvedValue(
      new Expense({ id: '1', valor: 150, data_compra: '2026-05-01', descricao: 'Almoço', tipo_pagamento_id: '1', categoria_id: '2', estabelecimento_id: '20' }),
    );

    await useCase.execute(makeCreateDTO());

    expect(addressRepo.create).not.toHaveBeenCalled();
    expect(establishmentRepo.create).toHaveBeenCalledTimes(1);
  });

  it('deve reutilizar estabelecimento existente', async () => {
    addressService.getAddressByZipCode.mockResolvedValue(mockAddressData);
    addressRepo.findByCepAndNumber.mockResolvedValue(mockAddress);
    establishmentRepo.findByEnderecoId.mockResolvedValue(mockEstablishment);
    expenseRepo.create.mockResolvedValue(
      new Expense({ id: '1', valor: 150, data_compra: '2026-05-01', descricao: 'Almoço', tipo_pagamento_id: '1', categoria_id: '2', estabelecimento_id: '20' }),
    );

    await useCase.execute(makeCreateDTO());

    expect(addressRepo.create).not.toHaveBeenCalled();
    expect(establishmentRepo.create).not.toHaveBeenCalled();
    expect(expenseRepo.create).toHaveBeenCalledTimes(1);
  });
});
