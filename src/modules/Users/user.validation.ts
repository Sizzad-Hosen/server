// validations/user.validation.ts
import { z } from "zod";

export const CreateUserValidation = z.object({

  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["admin", "customer"]).optional(), 

});

export const UserValidationSchemas = {
 CreateUserValidation
}