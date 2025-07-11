



import { z } from 'zod';

export const ServiceZodSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
});
