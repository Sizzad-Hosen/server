import mongoose, { Schema } from "mongoose";
import { ICustomer } from "./customer.interface";


const customerSchema = new Schema<ICustomer>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model<ICustomer>('Customer', customerSchema);