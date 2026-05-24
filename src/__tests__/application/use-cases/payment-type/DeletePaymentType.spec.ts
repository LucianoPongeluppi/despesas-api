import { DeletePaymentType } from '@/application/use-cases/payment-type/DeletePaymentType';
import { AppError } from '@/shared/error/AppError';
import { PaymentType } from '@/domain/entities/PaymentType';
import { makePaymentTypeRepository } from '@/__tests__/mocks/repositories';

describe('DeletePaymentType', () => {
  let repo: ReturnType<typeof makePaymentTypeRepository>;
  let useCase: DeletePaymentType;

  beforeEach(() => {
    repo = makePaymentTypeRepository();
    useCase = new DeletePaymentType(repo);
  });

  it('deve deletar um tipo de pagamento existente', async () => {
    repo.findById.mockResolvedValue(new PaymentType({ id: '1', tipo: 'Pix' }));
    repo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute('1')).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith('1');
  });

  it('deve lançar AppError 404 quando o tipo não é encontrado', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('99')).rejects.toThrow(AppError);
    await expect(useCase.execute('99')).rejects.toMatchObject({ statusCode: 404 });
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
