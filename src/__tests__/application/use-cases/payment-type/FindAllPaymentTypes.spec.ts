import { FindAllPaymentTypes } from '@/application/use-cases/payment-type/FindAllPaymentTypes';
import { PaymentType } from '@/domain/entities/PaymentType';
import { makePaymentTypeRepository } from '@/__tests__/mocks/repositories';

describe('FindAllPaymentTypes', () => {
  let repo: ReturnType<typeof makePaymentTypeRepository>;
  let useCase: FindAllPaymentTypes;

  beforeEach(() => {
    repo = makePaymentTypeRepository();
    useCase = new FindAllPaymentTypes(repo);
  });

  it('deve retornar todos os tipos de pagamento', async () => {
    const types = [
      new PaymentType({ id: '1', tipo: 'Pix' }),
      new PaymentType({ id: '2', tipo: 'Crédito' }),
    ];
    repo.findAll.mockResolvedValue(types);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].tipo).toBe('Pix');
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar array vazio quando não há tipos cadastrados', async () => {
    repo.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });
});
