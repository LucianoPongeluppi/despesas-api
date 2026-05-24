import { UpdateExpenseDTO } from '@/application/dtos/ExpenseDTO';
import { IAddressService } from '@/application/services/AddressService';
import { Address } from '@/domain/entities/Address';
import { Expense } from '@/domain/entities/Expense';
import { Establishment } from '@/domain/entities/Establishment';
import { IAddressRepository } from '@/domain/repositories/IAddressRepository';
import { IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { IEstablishmentRepository } from '@/domain/repositories/IEstablishmentRepository';
import { AppError } from '@/shared/error/AppError';

export class UpdateExpense {
  constructor(
    private expenseRepository: IExpenseRepository,
    private addressService: IAddressService,
    private addressRepository: IAddressRepository,
    private establishmentRepository: IEstablishmentRepository
  ) {}

  async execute(id: string, data: UpdateExpenseDTO): Promise<Expense> {
    const expense = await this.expenseRepository.findById(id);

    if (!expense) {
      throw new AppError('Despesa não encontrada', 404);
    }

    let establishmentId = expense.estabelecimento_id ?? null;

    if (typeof data.zipCode === 'string') {
      let foundAddress = await this.addressRepository.findByCepAndNumber(
        data.zipCode,
        data.addressNumber ?? ''
      );

      if (!foundAddress) {
        const addressData = await this.addressService.getAddressByZipCode(data.zipCode);

        foundAddress = await this.addressRepository.create(
          new Address({
            cep: addressData.zipCode,
            uf: addressData.state,
            cidade: addressData.city,
            bairro: addressData.neighborhood,
            logradouro: addressData.street,
            numero: data.addressNumber ?? null,
          })
        );
      }

      let foundEstablishment = await this.establishmentRepository.findByEnderecoId(
        foundAddress.id ?? ''
      );

      if (!foundEstablishment) {
        foundEstablishment = await this.establishmentRepository.create(
          new Establishment({
            endereco_id: foundAddress.id ?? null,
          })
        );
      }

      establishmentId = foundEstablishment.id ?? null;
    }

    const updatedExpense = new Expense({
      id: expense.id,
      valor: data.value ?? expense.valor,
      data_compra: data.purchaseDate ?? expense.data_compra,
      descricao: data.description ?? expense.descricao,
      tipo_pagamento_id: data.paymentTypeId ?? expense.tipo_pagamento_id,
      categoria_id: data.categoryId ?? expense.categoria_id,
      estabelecimento_id: establishmentId,
    });

    return await this.expenseRepository.update(id, updatedExpense);
  }
}
