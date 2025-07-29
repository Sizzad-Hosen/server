import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    
    orderId: z.string().nonempty("orderId is required"),
 
  }),
});


export const PaymentValidationSchemas = {
    createPaymentSchema
}