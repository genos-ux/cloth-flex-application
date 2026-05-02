import { db } from "../../config/db";
import {Category, Product} from "../../db/schema";
import {and, desc, eq, ilike, sql} from "drizzle-orm";
import {BadRequestException, NotFoundException} from "../../utils/exception";
import {findProductById} from "../carts/cart.service.ts";

function generateSKU(name: string) {
    const prefix = name.slice(0, 4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${random}`;
}


export function calculateInventory(quantity: number) {
  let status: "IN_STOCK" | "LOW" | "CRITICAL" | "OUT_OF_STOCK";
  let level: number;

  if (quantity === 0) {
    status = "OUT_OF_STOCK";
    level = 0;
  } else if (quantity <= 5) {
    status = "CRITICAL";
    level = 10;
  } else if (quantity <= 10) {
    status = "LOW";
    level = 40;
  } else {
    status = "IN_STOCK";
    level = 100;
  }

  return { status, level };
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  size: string;
  quantity: number;
  images: string[];
}) {
  try {
    const { status, level } = calculateInventory(
        data.quantity ?? 0
    );

    const existingProduct = await db
        .select()
        .from(Product)
        .where(eq(Product.name, data.name));

    if (existingProduct.length > 0) {
      throw new BadRequestException("Product already exists");
    }

    const [product] = await db
        .insert(Product)
        .values({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          categoryId: data.categoryId,
          size: data.size,
          quantity: data.quantity ?? 0,
          images: data.images,
            sku: generateSKU(data.name),
          status,
          level,
        })
        .returning();

    await db
        .update(Category)
        .set({
          productsCount: sql`${Category.productsCount} + 1`,
        })
        .where(eq(Category.id, data.categoryId));

    return product;
  } catch (err) {
    console.error("Failed to create product:", err);
    throw err;
  }
}




export async function getAllProducts({page = 1, limit = 10, search, categoryId,size,}: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    size?: string;
}) {
    const offset = (page - 1) * limit;

    const conditions = [];

    // search by product name
    if (search) {
        conditions.push(ilike(Product.name, `%${search}%`));
    }

    // filter by category
    if (categoryId) {
        conditions.push(eq(Product.categoryId, categoryId));
    }

    // filter by size
    if (size) {
        conditions.push(eq(Product.size, size));
    }

    const products = await db
        .select()
        .from(Product)
        .where(conditions.length ? and(...conditions) : undefined)
        .limit(limit)
        .offset(offset);

    return products;
}


export async function getProductById(id: string) {
  try {
    const [product] = await db
        .select()
        .from(Product)
        .where(eq(Product.id, id));

    if (!product)
      throw new NotFoundException("Product not found");

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
      categoryId: string;
      size: string;
      quantity: number;
      images: string[];
    }>
) {
  try {
    let updateData: any = {
      ...data,
    };

    // convert price
    if (data.price) {
      updateData.price = data.price.toString();
    }

    // recompute inventory if quantity changes
    if (data.quantity !== undefined) {
      const { status, level } = calculateInventory(
          data.quantity
      );

      updateData.status = status;
      updateData.level = level;
    }

    const [product] = await db
        .update(Product)
        .set(updateData)
        .where(eq(Product.id, id))
        .returning();

    return product;
  } catch (err) {
    console.error("Failed to update product:", err);
    throw err;
  }
}


export async function addMultipleImages(productId: string, imageUrls: string[]) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const existingImages = product.images || [];

  const updatedImages = [...existingImages, ...imageUrls];

  const [updatedProduct] = await db
      .update(Product)
      .set({
        images: updatedImages,
      })
      .where(eq(Product.id, productId))
      .returning();

  return {
    success: true,
    message: "Images added successfully",
    data: updatedProduct,
  };
}


export async function deleteProduct(id: string) {
  try {
    const [product] = await db
        .delete(Product)
        .where(eq(Product.id, id))
        .returning();

    if (!product)
      throw new NotFoundException("Product not found");

    await db
        .update(Category)
        .set({
          productsCount: sql`${Category.productsCount} - 1`,
        })
        .where(eq(Category.id, product.categoryId));

    return {
      message: "Product deleted successfully",
    };
  } catch (err) {
    console.error("Failed to delete product:", err);
    throw err;
  }
}