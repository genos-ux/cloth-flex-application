import { db } from "../../config/db";
import { Product } from "../../db/schema";
import { eq } from "drizzle-orm";
import {NotFoundException} from "../../utils/exception";

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  inStock?: boolean;
  images: string[];
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

export async function getAllProducts() {
  try {
    return await db.select().from(Product);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    throw err;
  }
}

export async function getProductById(id: string) {
  try {
    const [product] = await db.select().from(Product).where(eq(Product.id, id));

    if(!product) throw new NotFoundException('Product not found');
    return product;
  } catch (err) {
    console.error("Failed to fetch product by ID:", err);
    throw err;
  }
}

export async function updateProduct(
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

export async function deleteProduct(id: string) {
  try {
    await db.delete(Product).where(eq(Product.id, id));
    return { message: "Product deleted successfully" };
  } catch (err) {
    console.error("Failed to delete product:", err);
    throw err;
  }
}