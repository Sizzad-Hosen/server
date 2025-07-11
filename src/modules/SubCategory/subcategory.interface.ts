import { Types } from 'mongoose';

export interface TSubCategory {
  name: string;
  slug?: string; // Optional (auto-generated)
  categoryId: Types.ObjectId;
  serviceId: Types.ObjectId;
}
