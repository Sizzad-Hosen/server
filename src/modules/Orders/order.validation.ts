import { z } from "zod";


export const createShippingAddressSchema = z.object({

  fullName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  
});

export const createOrderSchema = z.object({
  body: z.object({

    paymentMethod: z.enum(["cash_on_delivery", "bkash", "nagad", "sslcommerz"]),

    shippingAddress: createShippingAddressSchema,

  }),
});

export const OrderValidationSchemas = {
  createOrderSchema,
};
