import { db } from "../../config/db";
import { Product } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function createProductService(data: {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock?: boolean;
  imageUrl: string;
}) {
  try {
    const [product] = await db.insert(Product).values({
        ...data,
        price: data.price.toString(),
    }).returning();
    return product;
  } catch (err) {
    console.error("Failed to create product:", err);
    throw err;
  }
}

export async function getAllProductsService() {
  try {
    return await db.select().from(Product);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    throw err;
  }
}

export async function getProductByIdService(id: string) {
  try {
    const [product] = await db.select().from(Product).where(eq(Product.id, id));
    return product;
  } catch (err) {
    console.error("Failed to fetch product by ID:", err);
    throw err;
  }
}

export async function updateProductService(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    imageUrl: string;
  }>
) {
  try {
    const [product] = await db.update(Product).set({
        ...data, 
        price: data.price ? data.price.toString() : undefined, 
    }).where(eq(Product.id, id)).returning();
    return product;
  } catch (err) {
    console.error("Failed to update product:", err);
    throw err;
  }
}

export async function deleteProductService(id: string) {
  try {
    await db.delete(Product).where(eq(Product.id, id));
    return { message: "Product deleted successfully" };
  } catch (err) {
    console.error("Failed to delete product:", err);
    throw err;
  }
}