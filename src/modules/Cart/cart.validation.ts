import { z } from 'zod';

export const addToCartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  title: z.string().min(1, 'Title is required'),
  price: z.number({ required_error: 'Price is required' }).min(0),
  quantity: z.number({ required_error: 'Quantity is required' }).min(1),
  image: z.string().url().optional(),
  selectedSize: z.object({
    label: z.string().min(1, 'Size label is required'),
    price: z.number({ required_error: 'Size price is required' }).min(0),
  }),
  discount: z.number().optional().default(0),
});

export const addToCartSchema = z.object({
  body: addToCartItemSchema,
});

export const checkOutCartSchema = z.object({
  body: z.object({
    items: z.array(addToCartItemSchema, { required_error: 'Items are required' }).min(1),
  }),
});

export const removeFromCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    selectedSize: z.object({
      label: z.string().min(1),
      price: z.number(),
    }),
  }),
});

export const CartValidationSchemas = {
  addToCartSchema,
  checkOutCartSchema,
  removeFromCartSchema,
};
