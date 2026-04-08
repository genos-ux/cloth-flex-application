import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be greater than 0"),
  imageUrl: z.string().url("Image must be a valid URL"),
  category: z.string().min(2, "Category is required"),
  inStock: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();