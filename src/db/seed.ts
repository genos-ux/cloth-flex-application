import { db } from "../config/db";
import { Product } from "../db/schema";
import {eq} from "drizzle-orm";

function generateSKU(name: string) {
    const prefix = name.slice(0, 4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${random}`;
}

export async function backfillSKUs() {
    const products = await db.select().from(Product);

    for (const product of products) {
        if (!product.sku) {
            const sku = generateSKU(product.name);

            await db
                .update(Product)
                .set({ sku })
                .where(eq(Product.id, product.id));
        }
    }
}

backfillSKUs()