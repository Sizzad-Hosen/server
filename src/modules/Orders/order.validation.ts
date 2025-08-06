import { z } from "zod";


export const createShippingAddressSchema = z.object({

  fullName: z.string().min(1),
  phone: z.string().min(1),
  fullAddress: z.string().min(1),

  
});

export const createOrderSchema = z.object({
  body: z.object({

    paymentMethod: z.enum(["cash_on_delivery", "bkash", "nagad", "sslcommerz"]),

    address: createShippingAddressSchema,

  }),
});


export const orderStatusSchema = z.object({
  body:z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid order status value' }),
  }),
  })

});


export const OrderValidationSchemas = {
  createOrderSchema,
  orderStatusSchema
};
