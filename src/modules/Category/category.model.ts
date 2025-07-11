// models/category.model.ts
import { Schema, model, models, Types, Document } from 'mongoose';
import { TCategory } from './category.interface';

interface CategoryDocument extends TCategory, Document {}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },
  },
  { timestamps: true }
);

// Auto-generate slug before save
categorySchema.pre<CategoryDocument>('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

export const Category = models.Category || model<CategoryDocument>('Category', categorySchema);
