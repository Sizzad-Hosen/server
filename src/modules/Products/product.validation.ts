import { z } from 'zod';

const productSizeSchema = z.object({
  label: z
    .string()
    .min(1, { message: "Size label is required" }) // e.g., "1kg"
    .max(50, { message: "Size label cannot exceed 50 characters" }),

  price: z
    .number()
    .min(0, { message: "Size price must be greater than or equal to 0" }),

});

// Main product schema
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

    images: z.array(z.string()).optional(),

    price: z
      .number()
      .min(0, { message: 'Price must be greater than or equal to 0' }),

    discount: z
      .number()
      .min(0, { message: 'Discount must be greater than or equal to 0' })
      .optional(), // now optional (same as schema)

    sizes: z.array(productSizeSchema).optional(), 

    stock: z
      .string()
      .min(0, { message: 'Stock must be greater than or equal to 0' }),

    serviceId: z
      .string()
      .min(1, { message: 'Service ID is required' }),

    categoryId: z
      .string()
      .min(1, { message: 'Category ID is required' }),

    subCategoryId: z
      .string()
      .min(1, { message: 'SubCategory ID is required' }),

    isPublished: z.boolean().optional(),
  }),
});

export const ProductsValidationSchemas = {
  createProductSchema,
};
