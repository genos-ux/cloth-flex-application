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
});

export const updateCategorySchema =
    createCategorySchema.partial();