
import { eq } from "drizzle-orm";
import {Category} from "../../db/schema.ts";
import {db} from "../../config/db.ts";

export async function createCategory(data: {
    name: string;
    isVisible?: boolean;
    productsCount: number;
}) {
    const existingCategory = await db
        .select()
        .from(Category)
        .where(eq(Category.name, data.name));

    if (existingCategory.length > 0) {
        throw new Error("Category name already exists");
    }
    const [category] = await db
        .insert(Category)
        .values({
            name: data.name,
            isVisible: data.isVisible ?? true,
            productsCount: 0
        })
        .returning();

    return category;
}

export async function getAllCategories() {
    const categories = await db
        .select()
        .from(Category)
        .orderBy(Category.createdAt);

    return categories;
}

export async function getCategoryById(id: string) {
    const [category] = await db
        .select()
        .from(Category)
        .where(eq(Category.id, id));

    return category;
}

export async function updateCategory(
    id: string,
    data: {
        name?: string;
        isVisible?: boolean;
    }
) {
    if (data.name) {
        const existingCategory = await db
            .select()
            .from(Category)
            .where(eq(Category.name, data.name));

        if (existingCategory.length > 0 && existingCategory[0]?.id !== id) {
            throw new Error("Category name already exists");
        }
    }

    const [category] = await db
        .update(Category)
        .set(data)
        .where(eq(Category.id, id))
        .returning();

    return category;
}

export async function deleteCategory(id: string) {
    const [category] = await db
        .delete(Category)
        .where(eq(Category.id, id))
        .returning();

    return category;
}