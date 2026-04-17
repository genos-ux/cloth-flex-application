import { db } from "../../config/db";
import { Order, OrderItem, Product } from "../../db/schema";
import { eq } from "drizzle-orm";
import {BadRequestException} from "../../utils/exception";

export async function createOrder(data: any) {
    const productIds = data.items.map((i: any) => i.productId);

    const products = await db
        .select()
        .from(Product);

    let total = 0;

    const items = data.items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) throw new Error("Product not found");

        const price = Number(product.price);
        total += price * item.quantity;

        return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
        };
    });

    const [order] = await db.insert(Order).values({
        userId: data.userId || null,
        guestId: data.guestId || null,
        email: data.email,
        totalAmount: total.toString(),
    }).returning();

    if(!order) throw new BadRequestException('Order creation failed');

    await db.insert(OrderItem).values(
        items.map((i: any) => ({
            orderId: order.id,
            ...i,
        }))
    );

    return order;
}


export async function getAllOrders() {
    return await db.select().from(Order);
}


export async function getOrderById(id: string) {
    const [order] = await db
        .select()
        .from(Order)
        .where(eq(Order.id, id));

    return order;
}


export async function getUserOrders(userId: string) {
    return await db
        .select()
        .from(Order)
        .where(eq(Order.userId, userId));
}

/* ---------------- DELETE ORDER ---------------- */
export async function deleteOrder(id: string) {
    const [order] = await db
        .delete(Order)
        .where(eq(Order.id, id))
        .returning();

    return order;
}