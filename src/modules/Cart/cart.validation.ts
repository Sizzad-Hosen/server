
import { z } from 'zod';

export const addToCartSchema  = z.object({
body:z.object({
  productId: z.string().min(1, 'Product ID is required'),
  title: z.string().min(1, 'Title is required'),
  price: z.number({ required_error: 'Price is required' }).min(0),
  quantity: z.number({ required_error: 'Quantity is required' }).min(1),
  image: z.string().url().optional(),
})
});

export const checkOutCart = z.object({
body:z.object({
  items: z.array(cartItemSchema, { required_error: 'Items are required' }),
  totalQuantity: z.number({ required_error: 'Total quantity is required' }).min(1),
  totalAmount: z.number({ required_error: 'Total amount is required' }).min(1),
})


});


export const removeFromCartSchema = z.object({
  body: z.object({
    productId: z.string(),
  }),
});


export const CartValidationSchemas = {
  addToCartSchema,
  removeFromCartSchema,
};
