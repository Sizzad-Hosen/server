// interfaces/order.interface.ts
import { Types } from 'mongoose';

export interface TCustomBazerOrderItem {
  product: Types.ObjectId; 
  quantity: number;
  totalPrice: number; 
}

export interface TCustomBazerOrder {
  user: Types.ObjectId; // Reference to User model
  orderItems: TCustomBazerOrderItem[];
  totalAmount: number; // sum of all item totalPrice
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt?: Date;
  updatedAt?: Date;
}