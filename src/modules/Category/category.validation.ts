// validations/category.validation.ts
import { z } from 'zod';

export const createCategorySchema = z.object({
body:z.object({
      name: z.string().min(2, 'Category name is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
})
});

export const updateCategorySchema = z.object({
body:z.object({
      name: z.string().min(2, 'Category name is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
})
});



export const CategoryValidationSchemas = {
    createCategorySchema,
    updateCategorySchema
}