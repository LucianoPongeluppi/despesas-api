import { CreateCategoryDTO } from '@/application/dtos/CategoryDTO';
import { Category } from '@/domain/entities/Category';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

export class CreateCategory {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(data: CreateCategoryDTO): Promise<Category> {
    const category = new Category({
      nome: data.name,
      descricao: data.description
    });

    return await this.categoryRepository.create(category);
  }
}
