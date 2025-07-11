



import { z } from 'zod';

export const CreateService= z.object({

  body:z.object({
    name: z.string().min(1, 'Service name is required'),
  })

});


export const ServicesValidationSchemas = {
  CreateService

}