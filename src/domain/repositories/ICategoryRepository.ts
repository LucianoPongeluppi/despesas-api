import { Category } from '@/domain/entities/Category';

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  update(id: string, category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}
