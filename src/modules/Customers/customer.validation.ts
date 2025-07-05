import { z } from "zod";
import { Types } from "mongoose";

export const UpdatedCustomerValidationSchema = z.object({
  user: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid MongoDB ObjectId",
    }),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format")
    .optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().max(300).optional(),
  profileImage: z
    .string()
    .url("profileImage must be a valid URL")
    .optional(),
});


export const CustomerValidationSchema ={
    UpdatedCustomerValidationSchema

}