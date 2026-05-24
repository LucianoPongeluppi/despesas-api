import { AppError } from '@/shared/error/AppError';

describe('AppError', () => {
  it('deve criar erro com mensagem e statusCode informados', () => {
    const error = new AppError('Recurso não encontrado', 404);
    expect(error.message).toBe('Recurso não encontrado');
    expect(error.statusCode).toBe(404);
    expect(error).toBeInstanceOf(Error);
  });

  it('deve usar statusCode 400 como padrão', () => {
    const error = new AppError('Requisição inválida');
    expect(error.statusCode).toBe(400);
  });

  it('deve ser instância de AppError e Error', () => {
    const error = new AppError('Erro', 500);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });
});
