import { Schema, model } from "mongoose";
import { ICustomer } from "./customer.interface";


const customerSchema = new Schema<ICustomer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    profileImage: {
      type: String,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "ShippingAddress", 
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = model<ICustomer>("Customer", customerSchema);
