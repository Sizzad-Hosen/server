import { z } from 'zod';

export const createSubCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Subcategory name is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
    serviceId: z.string().min(1, 'Service ID is required'),
  }),
});

export const updateSubCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    categoryId: z.string().optional(),
    serviceId: z.string().optional(),
  }),
});

export const SubCategoryValidationSchemas = {
  createSubCategorySchema,
  updateSubCategorySchema,
};
