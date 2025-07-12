import { Types } from 'mongoose';

export interface TCartItem {
  productId: Types.ObjectId | string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface TCart {
  userId: Types.ObjectId | string;
  items: TCartItem[];
  totalQuantity: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
