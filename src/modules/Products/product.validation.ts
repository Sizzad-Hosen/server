import { z } from 'zod';

export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),
    
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
    
  images: z
    .array(z.string().url({ message: 'Each image must be a valid URL' }))
    .nonempty({ message: 'At least one image is required' }),

  price: z
    .number()
    .min(0, { message: 'Price must be greater than or equal to 0' }),

  quantity: z
    .number()
    .min(0, { message: 'Quantity must be greater than or equal to 0' }),

  category: z
    .string()
    .min(1, { message: 'Category is required' }),

  isPublished: z.boolean(),

});


export const ProductValidationSchemas = {
    createProductSchema 
}