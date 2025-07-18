import { z } from "zod";
import { addToCartSchema } from "../Cart/cart.validation";
import { createShippingAddressSchema } from "../Address/address.validation";

export const createOrderSchema = z.object({

    body:z.object({

        userId: z.string().min(1),
        items: z.array(addToCartSchema).min(1),
        totalQuantity: z.number().int().positive(),
        totalPrice: z.number().nonnegative(),
        shippingAddressId: z.string().min(1),
          paymentId: z.string().optional(),
        shippingAddress: createShippingAddressSchema.optional(),
        paymentMethod: z.enum(["cash_on_delivery", "bkash", "nagad"]),
        status: z
            .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
            .optional(),

    })



});


export const OrderValidationSchemas = {
    createOrderSchema
}