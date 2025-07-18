import z from "zod";


export const createShippingAddressSchema = z.object({

  body:z.object({


  division: z.string().min(2, "Division is required"),
  district: z.string().min(2, "District is required"),
  postalCode: z.string()
    .regex(/^\d{4}$/, "Postal code must be 4 digits"),
  phoneNumber: z.string()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  location: z.string().min(3, "Location is required"),
  messOrBasaName: z.string().min(2, "Mess or house name is required"),
  paraName: z.string().min(2, "Para name is required").optional(),

  })


});
const updateShippingAddressSchema = z.object({

  body:z.object({


  division: z.string().min(2, "Division is required"),
  district: z.string().min(2, "District is required"),
  postalCode: z.string()
    .regex(/^\d{4}$/, "Postal code must be 4 digits"),
  phoneNumber: z.string()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  location: z.string().min(3, "Location is required"),
  messOrBasaName: z.string().min(2, "Mess or house name is required"),
  paraName: z.string().min(2, "Para name is required").optional(),

  })


});


export const shippingAddressValidationSchemas = {

    createShippingAddressSchema,
    updateShippingAddressSchema
}