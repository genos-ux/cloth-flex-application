import { z } from "zod";

export const createProductSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),

    price: z.coerce
        .number()
        .refine((val) => !isNaN(val), {
            message: "Price must be a valid number",
        })
        .positive("Price must be positive"),

    categoryId: z
        .string()
        .uuid("Invalid category ID"),

    size: z
        .string()
        .min(1, "Size is required"),

    quantity: z
        .coerce
        .number()
        .int("Quantity must be an integer")
        .min(0, "Quantity cannot be negative")
        .default(0),

    // images: z
    //     .array(z.string().url("Invalid image URL"))
    //     .min(1, "At least one image is required"),
});