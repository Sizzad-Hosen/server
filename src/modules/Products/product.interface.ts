import { Types } from 'mongoose';

export interface IProduct {
  title: string;
  name: string; 
  description: string;
  images?: string[]; 
  price: number;
  quantity: number;

  serviceId: Types.ObjectId;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
 discount?: number;
  isPublished: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
