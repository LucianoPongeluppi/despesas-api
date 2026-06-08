import { EnrichPendingAddresses } from '@/application/use-cases/address/EnrichPendingAddresses';
import { Address } from '@/domain/entities/Address';
import { AppError } from '@/shared/error/AppError';
import { makeAddressRepository, makeAddressService } from '@/__tests__/mocks/repositories';

const makePendingAddress = (overrides?: Partial<ConstructorParameters<typeof Address>[0]>) =>
  new Address({
    id: '1',
    cep: '01310100',
    numero: '1000',
    enriched: false,
    enrichment_attempts: 0,
    ...overrides,
  });

const mockViaCepResponse = {
  zipCode: '01310100',
  street: 'Av. Paulista',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
};

describe('EnrichPendingAddresses', () => {
  let addressRepo: ReturnType<typeof makeAddressRepository>;
  let addressService: ReturnType<typeof makeAddressService>;
  let useCase: EnrichPendingAddresses;

  beforeEach(() => {
    addressRepo = makeAddressRepository();
    addressService = makeAddressService();
    useCase = new EnrichPendingAddresses(addressRepo, addressService);
  });

  it('deve enriquecer endereços pendentes com sucesso', async () => {
    addressRepo.findPendingEnrichment.mockResolvedValue([makePendingAddress()]);
    addressService.getAddressByZipCode.mockResolvedValue(mockViaCepResponse);
    addressRepo.enrich.mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(addressService.getAddressByZipCode).toHaveBeenCalledWith('01310100');
    expect(addressRepo.enrich).toHaveBeenCalledWith('1', {
      uf: 'SP',
      cidade: 'São Paulo',
      bairro: 'Bela Vista',
      logradouro: 'Av. Paulista',
    });
    expect(result).toEqual({ enriched: 1, failed: 0, skipped: 0 });
  });

  it('deve ignorar endereços sem cep', async () => {
    addressRepo.findPendingEnrichment.mockResolvedValue([
      makePendingAddress({ cep: null }),
    ]);

    const result = await useCase.execute();

    expect(addressService.getAddressByZipCode).not.toHaveBeenCalled();
    expect(result).toEqual({ enriched: 0, failed: 0, skipped: 1 });
  });

  it('deve registrar falha quando o CEP não existe no ViaCEP (404)', async () => {
    addressRepo.findPendingEnrichment.mockResolvedValue([makePendingAddress()]);
    addressService.getAddressByZipCode.mockRejectedValue(new AppError('CEP não encontrado', 404));
    addressRepo.failEnrichment.mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(addressRepo.enrich).not.toHaveBeenCalled();
    expect(addressRepo.failEnrichment).toHaveBeenCalledWith('1');
    expect(result).toEqual({ enriched: 0, failed: 1, skipped: 0 });
  });

  it('deve registrar falha quando o ViaCEP retorna erro de servidor', async () => {
    addressRepo.findPendingEnrichment.mockResolvedValue([makePendingAddress()]);
    addressService.getAddressByZipCode.mockRejectedValue(new Error('Network error'));
    addressRepo.failEnrichment.mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(addressRepo.failEnrichment).toHaveBeenCalledWith('1');
    expect(result).toEqual({ enriched: 0, failed: 1, skipped: 0 });
  });

  it('deve processar vários endereços retornando contagens corretas', async () => {
    addressRepo.findPendingEnrichment.mockResolvedValue([
      makePendingAddress({ id: '1', cep: '01310100' }),
      makePendingAddress({ id: '2', cep: '00000000' }),
      makePendingAddress({ id: '3', cep: null }),
    ]);
    addressService.getAddressByZipCode
      .mockResolvedValueOnce(mockViaCepResponse)
      .mockRejectedValueOnce(new AppError('CEP não encontrado', 404));
    addressRepo.enrich.mockResolvedValue(undefined);
    addressRepo.failEnrichment.mockResolvedValue(undefined);

    const result = await useCase.execute();

    expect(result).toEqual({ enriched: 1, failed: 1, skipped: 1 });
  });

  it('não deve enriquecer quando não há pendências', async () => {
    addressRepo.findPendingEnrichment.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(addressService.getAddressByZipCode).not.toHaveBeenCalled();
    expect(result).toEqual({ enriched: 0, failed: 0, skipped: 0 });
  });
});
