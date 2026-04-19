import { db } from "../../config/db";
import {Cart, CartItem, Order, Product} from "../../db/schema";
import { eq, and, } from "drizzle-orm";

/* -----------------------------
   GET USER CART
------------------------------*/
export async function findUserCart(userId: string) {
    return await db.select().from(Cart).where(eq(Cart.userId, userId));
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
) {
    return await db.select().from(Product).where(eq(Product.id, productId));
}


export async function findCartItem(
    cartId: string,
    productId: string
) {
    return await db
        .select()
        .from(CartItem)
        .where(
            and(
                eq(CartItem.cartId, cartId),
                eq(CartItem.productId, productId)
            )
        )
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


// export async function incrementCartItem(
//     id: string,
//     quantity: number
// ) {
//     // const item = await db.query.CartItem.findFirst({
//     //     where: eq(CartItem.id, id),
//     // });
//     const item = await db.select().from(CartItem).where(eq(CartItem.id, id))
//
//     if (!item) return null;
//
//     await db
//         .update(CartItem)
//         .set({
//             quantity: item.quantity + quantity,
//         })
//         .where(eq(CartItem.id, id));
//
//     return item;
// }

export async function deleteCartItem(
    id: string
) {
    await db
        .delete(CartItem)
        .where(eq(CartItem.id, id));
}

/* -----------------------------
   CLEAR CART
------------------------------*/
export async function clearUserCart(
    cartId: string
) {
    await db
        .delete(CartItem)
        .where(eq(CartItem.cartId, cartId));
}