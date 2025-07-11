// interfaces/category.interface.ts
import { Types } from 'mongoose';

export interface TCategory {
  name: string;
  slug?: string; // optional because it's auto-generated
  serviceId: Types.ObjectId | string;
}
