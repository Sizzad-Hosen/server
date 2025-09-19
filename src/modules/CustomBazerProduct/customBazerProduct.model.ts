import { Schema, model } from 'mongoose';
import { TCustomProduct } from './customBazerProduct.interface';

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Subcategory name is required'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'gm', 'piece', 'litre'],
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number'],
    },
    size:{
      type:String,
      required:false
    }
  },
  { _id: false }
);

const customBazerProductSchema = new Schema<TCustomProduct>(
  {
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    subcategories: {
      type: [subcategorySchema],
      required: true,
    },
  },
  { timestamps: true }
);

export const CustomBazerProductModel = model<TCustomProduct>(
  'CustomBazerProduct',
  customBazerProductSchema
);
