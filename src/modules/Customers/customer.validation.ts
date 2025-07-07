import { z } from "zod";
import { Types } from "mongoose";

export const CreateCustomerValidation = z.object({

body:z.object({
    gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().max(300).optional(),
  profileImage: z
    .string()
    .url("profileImage must be a valid URL")
    .optional(),
})
});
export const UpdateCustomerValidation = z.object({

body:z.object({
    gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().max(300).optional(),
  profileImage: z
    .string()
    .url("profileImage must be a valid URL")
    .optional(),
})
});


export const CustomerValidationSchema ={
   CreateCustomerValidation,
   UpdateCustomerValidation

}