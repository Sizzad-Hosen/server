import { Types } from 'mongoose';

export interface IProductSize {
  label: string;
  price: number;
}

export interface TCartItem {
  productId: Types.ObjectId | string;
  title: string;
  price: number;         // price of the selected size
  selectedSize: IProductSize;  // store only the chosen size
  quantity: number;
  image?: string;
  discount?: number;
}

export interface TCart {
  userId: Types.ObjectId | string;
  items: TCartItem[];
  totalQuantity: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
