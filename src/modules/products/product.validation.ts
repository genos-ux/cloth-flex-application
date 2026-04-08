import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce
      .number()
      .refine((val) => !isNaN(val), {
        message: "Price must be a valid number",
      })
      .positive("Price must be positive"),
  category: z.string().min(2, "Category is required"),
    inStock: z
        .transform((val) => {
            // val can be undefined or string
            if (val === undefined) return true; // default
            if (val === "true") return true;
            if (val === "false") return false;
            return Boolean(val);
        }),
});

export const updateProductSchema = createProductSchema.partial();