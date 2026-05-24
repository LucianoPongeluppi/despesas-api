import pool from '@/config/pool';
import { Category } from '@/domain/entities/Category';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

export class CategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const result = await pool.query(
      'INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING id, nome, descricao',
      [category.nome, category.descricao]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async findAll(): Promise<Category[]> {
    const result = await pool.query('SELECT id, nome, descricao FROM categorias');

    return result.rows.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Category | null> {
    const result = await pool.query('SELECT id, nome, descricao FROM categorias WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    };

    return this.mapToEntity(result.rows[0]);
  }

  async update(id: string, category: Category): Promise<Category> {
    const result = await pool.query(
      'UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3 RETURNING id, nome, descricao',
      [category.nome, category.descricao, id]
    );

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
  }

  private mapToEntity(category: { id: string; nome: string; descricao: string }): Category {
    return new Category({
      id: category.id,
      nome: category.nome,
      descricao: category.descricao,
    });
  }
}
