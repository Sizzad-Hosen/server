import z from "zod";

// Schema for individual order item
export const customBazerOrderItemSchema = z.object({
  product: z.string({ required_error: 'Product ID is required' }),
  subcategoryName: z.string({ required_error: 'Subcategory name is required' }),
  unit: z.enum(['kg', 'gm', 'piece', 'litre'], {
    required_error: 'Unit is required',
    invalid_type_error: 'Unit must be one of kg, gm, piece, litre',
  }),
  pricePerUnit: z.number().min(0, 'Price per unit must be at least 0'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  totalPrice: z.number().min(0, 'Total price must be at least 0').optional(), // calculated on backend
});

// Main schema for order creation
export const createCustomBazerOrder = z.object({
  body: z.object({
    orderItems: z
      .array(customBazerOrderItemSchema)
      .nonempty('Order must have at least one item'),

    totalAmount: z.number().min(0, 'Total amount must be at least 0').optional(), // calculated

    status: z.enum( ["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
      deletedByUser: z.boolean().optional(),

    paymentMethod: z.enum(['sslcommerz', 'cash_on_delivery'], {
      required_error: 'Payment method is required',
    }),
 deliveryOption: z.enum(["insideRangpur", "outsideRangpur"]),
    address: z.object({
      fullName: z.string({ required_error: 'Full name is required' }),
      phoneNumber: z.string({ required_error: 'Phone number is required' }),
      fullAddress: z.string({ required_error: 'Full address is required' }),
    }),

    siteNote: z.string().optional(),
    
  }),
});

export const orderPaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending","paid", "success", "failed"], {
      errorMap: () => ({ message: "Invalid payment status value" }),
    }),
  }),
});

// Export
export const CustomBazerOrderValidationSchemas = {
  createCustomBazerOrder,
  orderPaymentStatusSchema
};
