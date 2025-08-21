import mongoose, { Schema, model, models, Types } from 'mongoose';
import { TCart, TCartItem, IProductSize } from './cart.interface';

// Schema for selected size
const SelectedSizeSchema = new Schema<IProductSize>(
  {
    label: { type: String, required: [true, 'Selected size label is required'] },
    price: { type: Number, required: [true, 'Selected size price is required'], min: 0 },
  },
  { _id: false }
);

// Schema for individual cart items
const CartItemSchema = new Schema<TCartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
    discount: { type: Number, default: 0 },
    selectedSize: { type: SelectedSizeSchema, required: true }, // <-- key fix
  },
  { _id: false }
);

// Schema for entire cart
const CartSchema = new Schema<TCart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
    totalQuantity: { type: Number, required: true, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Cart = models.Cart || model<TCart>('Cart', CartSchema);
