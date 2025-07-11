import { Schema, model, Types, models } from 'mongoose';
import { TSubCategory } from './subcategory.interface';

const subCategorySchema = new Schema<TSubCategory>(
  {
    name: {
      type: String,
      required: [true, 'Subcategory name is required'],
      trim: true,
    },
     slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },
  },
  {
    timestamps: true,
  }
);


subCategorySchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       
      .replace(/[^\w\-]+/g, '')   
      .replace(/\-\-+/g, '-')   
      .replace(/^-+/, '')        
      .replace(/-+$/, '');     
  }
  next();
});

export const SubCategory = models.SubCategory || model<TSubCategory>('SubCategory', subCategorySchema);
