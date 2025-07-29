// models/order.model.ts
import { Schema, model } from 'mongoose';
import { TCustomBazerOrder } from './CustomBazerOrder.interface';


const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'CustomBazerProduct',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const customBazerOrderSchema = new Schema<TCustomBazerOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const CustomBazerOrderModel = model<TCustomBazerOrder>('CustomBazerOrder', customBazerOrderSchema );