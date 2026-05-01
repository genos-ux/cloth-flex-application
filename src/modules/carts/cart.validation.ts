import { z } from "zod";

/* -----------------------------
   ADD TO CART
------------------------------*/
export const addToCartSchema = z.object({
    productId: z
        .string()
        .uuid("Invalid product ID"),

    quantity: z
        .number()
        .int()
        .min(1, "Quantity must be at least 1")
        .default(1),
});

/* -----------------------------
   UPDATE CART ITEM
------------------------------*/
export const updateCartItemSchema = z.object({
    quantity: z
        .number()
        .int()
        .min(1, "Quantity must be at least 1"),
});

/* -----------------------------
   PARAMS
------------------------------*/
export const cartItemParamsSchema = z.object({
    id: z.string().uuid("Invalid cart item ID"),
});