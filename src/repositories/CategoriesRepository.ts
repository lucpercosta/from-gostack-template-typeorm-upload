import { EntityRepository, Repository } from 'typeorm';
import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async execute(category_id: string): Promise<Category | null> {
    const findCategory = await this.findOne({
      where: { category_id },
    });

    return findCategory || null;
  }
}

export default CategoriesRepository;
