import { z } from 'zod';

const subcategorySchema = z.object({
  name: z.string({
    required_error: 'Subcategory name is required',
    invalid_type_error: 'Subcategory name must be a string',
  }).min(1, 'Subcategory name cannot be empty'),

  unit: z.enum(['kg', 'gm', 'piece', 'litre'], {
    required_error: 'Unit is required',
    invalid_type_error: 'Unit must be one of kg, gm, piece, litre',
  }),

  pricePerUnit: z.number({
    required_error: 'Price per unit is required',
    invalid_type_error: 'Price must be a number',
  }).min(0, 'Price must be a positive number'),
});

export const CreateProduct = z.object({
  body: z.object({
    category: z.string({
      required_error: 'Product category is required',
      invalid_type_error: 'Category must be a string',
    }).min(1, 'Category cannot be empty'),

    subcategories: z.array(subcategorySchema).min(1, 'At least one subcategory is required'),
  }),
});

export const CustomBazerProduct = {
  CreateProduct,
};
