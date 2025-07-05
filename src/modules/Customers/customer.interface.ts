import { Types } from "mongoose";

export interface ICustomer extends Document {
  user: Types.ObjectId; 
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  profileImage?: string;
}
