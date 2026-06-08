import { IExpenseRepository } from '@/domain/repositories/IExpenseRepository';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { IPaymentTypeRepository } from '@/domain/repositories/IPaymentTypeRepository';
import { IAddressRepository } from '@/domain/repositories/IAddressRepository';
import { IEstablishmentRepository } from '@/domain/repositories/IEstablishmentRepository';
import { IAddressService } from '@/application/services/AddressService';

export const makeExpenseRepository = () =>
  ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }) as unknown as jest.Mocked<IExpenseRepository>;

export const makeCategoryRepository = () =>
  ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }) as unknown as jest.Mocked<ICategoryRepository>;

export const makePaymentTypeRepository = () =>
  ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByTipo: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }) as unknown as jest.Mocked<IPaymentTypeRepository>;

export const makeAddressRepository = () =>
  ({
    create: jest.fn(),
    findById: jest.fn(),
    findByCepAndNumber: jest.fn(),
    findPendingEnrichment: jest.fn(),
    enrich: jest.fn(),
    failEnrichment: jest.fn(),
  }) as unknown as jest.Mocked<IAddressRepository>;

export const makeEstablishmentRepository = () =>
  ({
    create: jest.fn(),
    findById: jest.fn(),
    findByIds: jest.fn(),
    findByAddressId: jest.fn(),
  }) as unknown as jest.Mocked<IEstablishmentRepository>;

export const makeAddressService = () =>
  ({
    getAddressByZipCode: jest.fn(),
  }) as unknown as jest.Mocked<IAddressService>;
