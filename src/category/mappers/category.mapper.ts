import { Category, CategoryDocument } from '../schemas/cagegory.schema';
import CategoryEntity from '../entities/category.entity';
import { Model } from 'mongoose';

export class CategoryMapper {
  static toEntity(categoryDocument: CategoryDocument): CategoryEntity {
    const category = new CategoryEntity();
    category.id = categoryDocument.id;
    category.name = categoryDocument.name;
    return category;
  }

  static toEntities(categoryDocuments: CategoryDocument[]): CategoryEntity[] {
    return categoryDocuments.map((categoryDocument) =>
      CategoryMapper.toEntity(categoryDocument),
    );
  }

  static async fromEntity(
    category: CategoryEntity,
    model: Model<Category>,
  ): Promise<CategoryDocument> {
    const document = category.id
      ? await model.findById(category.id).exec()
      : new model();

    document.name = category.name;

    return document;
  }
}
