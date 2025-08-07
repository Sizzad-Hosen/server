import { z } from "zod";

export const createShippingAddressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  fullAddress: z.string().min(1),
});

export const createOrderSchema = z.object({
  body: z.object({
    paymentMethod: z.enum(["cash_on_delivery", "sslcommerz"]),
    address: createShippingAddressSchema,
    deletedByUser: z.boolean().optional(),
  }),
});

export const orderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending","processing", "confirmed", "shipped", "delivered", "cancelled"], {
      errorMap: () => ({ message: "Invalid order status value" }),
    }),
  }),
});

export const orderPaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending","paid", "success", "failed"], {
      errorMap: () => ({ message: "Invalid payment status value" }),
    }),
  }),
});

export const OrderValidationSchemas = {
  createOrderSchema,
  orderStatusSchema,
  orderPaymentStatusSchema,
};
