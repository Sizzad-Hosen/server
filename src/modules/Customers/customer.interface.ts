import { Types, Document } from "mongoose";


export interface ICustomer extends Document {
  user: Types.ObjectId;
  gender?: "male" | "female" | "other";
  profileImage?: string;
  address?: Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}
