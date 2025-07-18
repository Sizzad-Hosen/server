import mongoose, { Schema, model, models, Types } from 'mongoose';
import { TCart, TCartItem } from './cart.interface';

// Schema for individual cart items
export const CartItemSchema = new Schema<TCartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    image: {
      type: String,
      default: '',
    },
  },
  { _id: false } 
);

// Schema for entire cart
const CartSchema = new Schema<TCart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // one cart per user
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Total quantity cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Total amount cannot be negative'],
    },
  },
  { timestamps: true }
);

export const Cart = models.Cart || model<TCart>('Cart', CartSchema);
