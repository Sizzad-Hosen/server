import { Types } from "mongoose";



export interface ICustomer extends Document {
  user: Types.ObjectId; 
  gender?: 'male' | 'female' | 'other';
  address?: string;
  profileImage?: string;
}
