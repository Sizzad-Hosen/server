import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, { message: 'Title must be at least 3 characters long' })
      .max(100, { message: 'Title cannot exceed 100 characters' }),

    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters long' })
      .max(100, { message: 'Name cannot exceed 100 characters' }),

    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters' }),

    images: z
      .array(z.string()).optional(),
    price: z
      .number()
      .min(0, { message: 'Price must be greater than or equal to 0' }),

    discount: z
      .number()
      .min(0, { message: 'Price must be greater than or equal to 0' }),

    quantity: z
      .number()
      .min(0, { message: 'Quantity must be greater than or equal to 0' }),

    serviceId: z
      .string()
      .min(1, { message: 'Service ID is required' }),

    categoryId: z
      .string()
      .min(1, { message: 'Category ID is required' }),

    subCategoryId: z
      .string()
      .min(1, { message: 'SubCategory ID is required' }),

    isPublished: z.boolean().optional()
  })
});



export const ProductsValidationSchemas = {
  createProductSchema,

}