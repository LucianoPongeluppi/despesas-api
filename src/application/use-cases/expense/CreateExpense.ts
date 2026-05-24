import { CreateExpenseDTO } from '@/application/dtos/ExpenseDTO';
import { IAddressService } from '@/application/services/AddressService';
import { Address } from '@/domain/entities/Address';
import { Expense } from '@/domain/entities/Expense';
import { Establishment } from '@/domain/entities/Establishment';
import { IAddressRepository } from '@/domain/repositories/IAddressRepository';
import { IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { IEstablishmentRepository } from '@/domain/repositories/IEstablishmentRepository';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { IPaymentTypeRepository } from '@/domain/repositories/IPaymentTypeRepository';
import { AppError } from '@/shared/error/AppError';

export class CreateExpense {
  constructor(
    private expenseRepository: IExpenseRepository,
    private categoryRepository: ICategoryRepository,
    private paymentTypeRepository: IPaymentTypeRepository,
    private addressService: IAddressService,
    private addressRepository: IAddressRepository,
    private establishmentRepository: IEstablishmentRepository
  ) {}

  async execute(data: CreateExpenseDTO): Promise<Expense> {
    const category = await this.categoryRepository.findById(data.categoryId);

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    const paymentType = await this.paymentTypeRepository.findById(data.paymentTypeId);

    if (!paymentType) {
      throw new AppError('Tipo de pagamento não encontrado', 404);
    }

    const address = await this.addressService.getAddressByZipCode(data.zipCode);

    let createdAddress = await this.addressRepository.findByCepAndNumber(
      address.zipCode,
      data.addressNumber
    );

    if (!createdAddress) {
      createdAddress = await this.addressRepository.create(
        new Address({
          cep: address.zipCode,
          uf: address.state,
          cidade: address.city,
          bairro: address.neighborhood,
          logradouro: address.street,
          numero: data.addressNumber,
        })
      );
    }

    let establishment = await this.establishmentRepository.findByEnderecoId(
      createdAddress.id ?? ''
    );

    if (!establishment) {
      establishment = await this.establishmentRepository.create(
        new Establishment({
          endereco_id: createdAddress.id ?? null,
        })
      );
    }

    const expense = new Expense({
      valor: data.value,
      data_compra: data.purchaseDate,
      descricao: data.description,
      tipo_pagamento_id: data.paymentTypeId,
      categoria_id: data.categoryId,
      estabelecimento_id: establishment.id ?? null,
    });

    return await this.expenseRepository.create(expense);
  }
}
