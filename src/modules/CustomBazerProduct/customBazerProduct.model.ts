import { Schema, model, Document } from 'mongoose';
import { TCustomProduct } from './customBazerProduct.interface';



const customBazerProductSchema = new Schema<TCustomProduct>(
{
category: {
type: String,
required: [true, 'Product category is required'],

},
subcategory: {
type: String,
required: [true, 'Subcategory is required'],
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
},
{ timestamps: true }
);

export const CustomBazerProductModel = model<TCustomProduct>('CustomBazerProduct', customBazerProductSchema);