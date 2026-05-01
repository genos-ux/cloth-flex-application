import { db } from "../../config/db";
import { Cart, CartItem, Product } from "../../db/schema";
import { eq, and } from "drizzle-orm";


export async function findUserCart(
    userId: string
){
    const [cart] = await db
        .select()
        .from(Cart)
        .where(eq(Cart.userId, userId));

    return cart;
}

export async function createCart(userId: string) {
    const [cart] = await db
        .insert(Cart)
        .values({ userId })
        .returning();

    return cart;
}


export async function findProductById(
    productId: string
){
    const [product] = await db
        .select()
        .from(Product)
        .where(eq(Product.id, productId));

    return product;
}

export async function findCartById(cartId: string) {
    const [cart] = await db.select().from(Cart).where(eq(Cart.id, cartId))
}

export async function getOrCreateCart(
    userId: string
): Promise<typeof Cart.$inferSelect> {
    const [existing] = await db
        .select()
        .from(Cart)
        .where(eq(Cart.userId, userId));

    if (existing) return existing;

    const [cart] = await db
        .insert(Cart)
        .values({ userId })
        .returning();

    if (!cart) {
        throw new Error("Failed to create cart");
    }

    return cart;
}


export async function findCartItem(
    cartId: string,
    productId: string
) {
    const [item] = await db
        .select()
        .from(CartItem)
        .where(
            and(
                eq(CartItem.cartId, cartId),
                eq(CartItem.productId, productId)
            )
        );

    return item ?? null;
}

export async function createCartItem(
    cartId: string,
    productId: string,
    quantity: number
) {
    const [item] = await db
        .insert(CartItem)
        .values({
            cartId,
            productId,
            quantity,
        })
        .returning();

    return item;
}

export async function updateCartItemQuantity(
    id: string,
    quantity: number
) {
    await db
        .update(CartItem)
        .set({ quantity })
        .where(eq(CartItem.id, id));
}

export async function incrementCartItem(
    id: string,
    quantity: number
) {
    const [item] = await db
        .select()
        .from(CartItem)
        .where(eq(CartItem.id, id));

    if (!item) return null;

    const newQty = item.quantity + quantity;

    await db
        .update(CartItem)
        .set({ quantity: newQty })
        .where(eq(CartItem.id, id));

    return { ...item, quantity: newQty };
}

export async function deleteCartItem(id: string) {
    await db.delete(CartItem).where(eq(CartItem.id, id));
}

export async function clearUserCart(cartId: string) {
    await db.delete(CartItem).where(eq(CartItem.cartId, cartId));
}