import { db } from "../../config/db";
import { Product, Category } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function getInventory() {
    const products = await db
        .select({
            id: Product.id,
            sku: Product.sku,
            name: Product.name,
            size: Product.size,
            status: Product.status,
            level: Product.level,
            quantity: Product.quantity,

            category: Category.name,
        })
        .from(Product)
        .leftJoin(Category, eq(Product.categoryId, Category.id));

    return products;
}