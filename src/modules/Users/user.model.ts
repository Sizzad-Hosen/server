// models/user.model.ts
import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";


const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      select: false, 
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
