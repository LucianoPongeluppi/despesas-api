import { UpdateExpense } from '@/application/use-cases/expense/UpdateExpense';
import { AppError } from '@/shared/error/AppError';
import { Expense } from '@/domain/entities/Expense';
import { Address } from '@/domain/entities/Address';
import { Establishment } from '@/domain/entities/Establishment';
import {
  makeExpenseRepository,
  makeAddressRepository,
  makeEstablishmentRepository,
  makeAddressService,
} from '@/__tests__/mocks/repositories';

const existingExpense = new Expense({
  id: '1',
  valor: 100,
  data_compra: '2026-05-01',
  descricao: 'Despesa original',
  tipo_pagamento_id: '1',
  categoria_id: '1',
  estabelecimento_id: '20',
});

const mockAddressData = {
  zipCode: '01310100',
  street: 'Av. Paulista',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
};

const mockAddress = new Address({ id: '10', cep: '01310100', uf: 'SP', cidade: 'São Paulo', bairro: 'Bela Vista', logradouro: 'Av. Paulista', numero: '2000' });
const mockEstablishment = new Establishment({ id: '21', endereco_id: '10' });

describe('UpdateExpense', () => {
  let expenseRepo: ReturnType<typeof makeExpenseRepository>;
  let addressRepo: ReturnType<typeof makeAddressRepository>;
  let establishmentRepo: ReturnType<typeof makeEstablishmentRepository>;
  let addressService: ReturnType<typeof makeAddressService>;
  let useCase: UpdateExpense;

  beforeEach(() => {
    expenseRepo = makeExpenseRepository();
    addressRepo = makeAddressRepository();
    establishmentRepo = makeEstablishmentRepository();
    addressService = makeAddressService();
    useCase = new UpdateExpense(expenseRepo, addressService, addressRepo, establishmentRepo);
  });

  it('deve atualizar despesa sem alterar endereço quando zipCode não é informado', async () => {
    const updated = new Expense({ ...existingExpense, valor: 200 });
    expenseRepo.findById.mockResolvedValue(existingExpense);
    expenseRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute('1', { value: 200 });

    expect(result.valor).toBe(200);
    expect(addressService.getAddressByZipCode).not.toHaveBeenCalled();
    expect(expenseRepo.update).toHaveBeenCalledTimes(1);
  });

  it('deve atualizar despesa com novo endereço quando zipCode é informado', async () => {
    const updated = new Expense({ ...existingExpense, estabelecimento_id: '21' });
    expenseRepo.findById.mockResolvedValue(existingExpense);
    addressService.getAddressByZipCode.mockResolvedValue(mockAddressData);
    addressRepo.findByCepAndNumber.mockResolvedValue(null);
    addressRepo.create.mockResolvedValue(mockAddress);
    establishmentRepo.findByEnderecoId.mockResolvedValue(null);
    establishmentRepo.create.mockResolvedValue(mockEstablishment);
    expenseRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute('1', { zipCode: '01310100', addressNumber: '2000' });

    expect(addressService.getAddressByZipCode).toHaveBeenCalledWith('01310100');
    expect(result.estabelecimento_id).toBe('21');
  });

  it('deve lançar AppError 404 quando a despesa não é encontrada', async () => {
    expenseRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute('99', { value: 100 })).rejects.toThrow(AppError);
    await expect(useCase.execute('99', { value: 100 })).rejects.toMatchObject({ statusCode: 404 });
    expect(expenseRepo.update).not.toHaveBeenCalled();
  });

  it('deve manter campos não informados com valores originais', async () => {
    expenseRepo.findById.mockResolvedValue(existingExpense);
    expenseRepo.update.mockResolvedValue(existingExpense);

    await useCase.execute('1', {});

    const updatedArg = expenseRepo.update.mock.calls[0][1];
    expect(updatedArg.valor).toBe(existingExpense.valor);
    expect(updatedArg.descricao).toBe(existingExpense.descricao);
    expect(updatedArg.categoria_id).toBe(existingExpense.categoria_id);
  });
});
