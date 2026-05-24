import { Request, Response } from 'express';
import { CreateCategory } from '@/application/use-cases/category/CreateCategory';
import { DeleteCategory } from '@/application/use-cases/category/DeleteCategory';
import { FindAllCategories } from '@/application/use-cases/category/FindAllCategories';
import { getParamsId } from '../utils/getParamsId';

export class CategoryController {
  constructor(
    private createCategory: CreateCategory,
    private findAllCategories: FindAllCategories,
    private deleteCategory: DeleteCategory
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    const category = await this.createCategory.execute(req.body);

    return res.status(201).json({
      data: category,
      success: true,
    });
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const categories = await this.findAllCategories.execute();

    return res.json({
      data: categories,
      success: true,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = getParamsId(req);

    await this.deleteCategory.execute(id);

    return res.status(200).json({
      data: null,
      success: true,
    });
  }
}
