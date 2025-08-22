import { Types } from 'mongoose';

export type UnitType = "kg" | "gm" | "liter" | "piece";

export interface IProductSize {
  label: string;        // e.g., "1 kg", "500 gm", "1 liter", "1 piece"
  price: number;        // price for this size

}

export interface IProduct {
  title: string;
  name: string;
  description: string;
  images?: string[];
  price: number;
  discount?: number;     // optional
  sizes: IProductSize[]; // product variations
  stock: boolean;
  serviceId: Types.ObjectId;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
