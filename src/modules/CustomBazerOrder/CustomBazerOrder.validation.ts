import z from "zod";


export const customBazerOrderItemSchema = z.object({

  product: z.string({ required_error: 'Product ID is required' }),
  quantity: z.number().min(1, 'Quantity must be at least 1').optional(), // optional in input
  totalPrice: z.number().min(0).optional(), // will be set in backend
});

export const createCustomBazerOrder = z.object({

body:z.object({
  orderItems: z.array(customBazerOrderItemSchema).nonempty('Order must have at least one item'),
    totalAmount: z.number().min(0).optional(), // backend calculates this
  status: z.enum(['pending', 'confirmed', 'delivered']).optional(),
})


});


export const CustomBazerOrderValidationSchemas = {

    createCustomBazerOrder
    
}