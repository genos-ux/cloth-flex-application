import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .min(2, "Category name must be at least 2 characters"),

    isVisible: z
        .coerce
        .boolean()
        .optional()
        .default(true),

    productsCount: z
        .coerce
        .number()
        .int()
        .min(0, "Products count cannot be negative")
        .default(0),


});

export const updateCategorySchema =
    createCategorySchema.partial();