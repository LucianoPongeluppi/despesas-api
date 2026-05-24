import { CreatePaymentType } from '@/application/use-cases/payment-type/CreatePaymentType';
import { AppError } from '@/shared/error/AppError';
import { PaymentType } from '@/domain/entities/PaymentType';
import { makePaymentTypeRepository } from '@/__tests__/mocks/repositories';

describe('CreatePaymentType', () => {
  let repo: ReturnType<typeof makePaymentTypeRepository>;
  let useCase: CreatePaymentType;

  beforeEach(() => {
    repo = makePaymentTypeRepository();
    useCase = new CreatePaymentType(repo);
  });

  it('deve criar um tipo de pagamento válido', async () => {
    const created = new PaymentType({ id: '1', tipo: 'Pix' });
    repo.findByTipo.mockResolvedValue(null);
    repo.create.mockResolvedValue(created);

    const result = await useCase.execute({ type: 'Pix' });

    expect(repo.findByTipo).toHaveBeenCalledWith('Pix');
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(result.tipo).toBe('Pix');
  });

  it('deve lançar AppError 409 quando o tipo já existe', async () => {
    repo.findByTipo.mockResolvedValue(new PaymentType({ id: '1', tipo: 'Pix' }));

    await expect(useCase.execute({ type: 'Pix' })).rejects.toThrow(
      new AppError('Tipo de pagamento já cadastrado', 409),
    );
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('deve lançar AppError 400 para tipo de pagamento inválido', async () => {
    await expect(useCase.execute({ type: 'Boleto' })).rejects.toThrow(AppError);
    expect(repo.findByTipo).not.toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it.each(['Dinheiro', 'Débito', 'Crédito', 'Pix'] as const)(
    'deve aceitar o tipo "%s"',
    async (tipo) => {
      repo.findByTipo.mockResolvedValue(null);
      repo.create.mockResolvedValue(new PaymentType({ id: '1', tipo }));

      await expect(useCase.execute({ type: tipo })).resolves.not.toThrow();
    },
  );
});
