import { z } from "zod";

export const createOrderSchema = z.object({
    userId: z.string().uuid().optional(),
    guestId: z.string().optional(),

    email: z.string().email(),

    items: z.array(
        z.object({
            productId: z.string().uuid(),
            quantity: z.number().min(1),
        })
    ),
});