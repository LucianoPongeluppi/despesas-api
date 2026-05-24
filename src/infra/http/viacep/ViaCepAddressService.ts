import { AppError } from '@/shared/error/AppError';
import { AddressData, IAddressService } from '@/application/services/AddressService';

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export class ViaCepAddressService implements IAddressService {
  async getAddressByZipCode(zipCode: string): Promise<AddressData> {
    const normalizedZip = zipCode.replace(/\D/g, '');

    if (normalizedZip.length !== 8) {
      throw new AppError('CEP inválido', 400);
    }

    const response = await fetch(`https://viacep.com.br/ws/${normalizedZip}/json/`);

    if (!response.ok) {
      throw new AppError('Erro ao consultar CEP', 502);
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      throw new AppError('CEP não encontrado', 404);
    }

    return {
      zipCode: normalizedZip,
      street: data.logradouro ?? '',
      neighborhood: data.bairro ?? '',
      city: data.localidade ?? '',
      state: data.uf ?? '',
    };
  }
}
