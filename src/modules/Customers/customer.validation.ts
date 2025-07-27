import { z } from "zod";

// Address schema with required fields (for creation)
const createShippingAddressSchema = z.object({
  division: z.string().min(2, "Division is required"),
  district: z.string().min(2, "District is required"),
  postalCode: z.string().regex(/^\d{4}$/, "Postal code must be 4 digits"),
  phoneNumber: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  location: z.string().min(3, "Location is required"),
  messOrBasaName: z.string().min(2, "Mess or house name is required"),
  paraName: z.string().min(2, "Para name is required").optional(),
});

// Creation schema - address is optional, but if present must have all required fields
export const CreateCustomerValidation = z.object({
  body: z.object({
    gender: z.enum(["male", "female", "other"]).optional(),
    address: createShippingAddressSchema.optional(),
    profileImage: z.string().url("Profile image must be a valid URL").optional(),
  }),
});

// Update schema - address is optional and all its fields are optional (partial update)
export const UpdateCustomerValidation = z.object({
  body: z.object({
    gender: z.enum(["male", "female", "other"]).optional(),
    address: createShippingAddressSchema.partial().optional(),
    profileImage: z.string().url("Profile image must be a valid URL").optional(),
  }),
});

export const CustomerValidationSchema = {
  CreateCustomerValidation,
  UpdateCustomerValidation,
};
