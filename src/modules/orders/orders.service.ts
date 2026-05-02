import { db } from "../../config/db";
import {Order, OrderItem, Product, User} from "../../db/schema";
import {eq, sql} from "drizzle-orm";
import {BadRequestException, NotFoundException} from "../../utils/exception";

import { inArray } from "drizzle-orm";
import {calculateInventory} from "../products/product.service.ts";

export async function createOrder(data: any) {
    if (!data.items || data.items.length === 0) {
        throw new BadRequestException("Order must contain at least one item");
    }

    const productIds = data.items.map((i: any) => i.productId);

    const products = await db
        .select()
        .from(Product)
        .where(inArray(Product.id, productIds));

    let total = 0;

    const items = data.items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) throw new NotFoundException("Product not found");

        if (product.quantity < item.quantity) {
            throw new BadRequestException(
                `${product.name} has insufficient stock`
            );
        }

        const price = Number(product.price);
        total += price * item.quantity;

        return {
            product,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
        };
    });

    return await db.transaction(async (tx) => {
        const [order] = await tx
            .insert(Order)
            .values({
                userId: data.userId || null,
                guestId: data.guestId || null,
                email: data.email,
                totalAmount: total.toString(),
            })
            .returning();

        await tx.insert(OrderItem).values(
            items.map((i: any) => ({
                orderId: order?.id,
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
            }))
        );

        for (const item of items) {
            const newQty = item.product.quantity - item.quantity;
            const { status, level } = calculateInventory(newQty);

            await tx
                .update(Product)
                .set({
                    quantity: newQty,
                    status,
                    level,
                })
                .where(eq(Product.id, item.productId));
        }

        return order;
    });
}


export async function getAllOrders() {
    const orders = await db.select().from(Order);
    const users = await db.select().from(User);
    const items = await db.select().from(OrderItem);
    const products = await db.select().from(Product);

    return orders.map((order) => {
        const user = users.find((u) => u.id === order.userId);

        const orderItems = items
            .filter((i) => i.orderId === order.id)
            .map((item) => {
                const product = products.find((p) => p.id === item.productId);

                return {
                    name: product?.name,
                    size: product?.size,
                    quantity: item.quantity,
                    price: item.price,
                };
            });

        return {
            id: order.id,

            customerName: user?.name || "Guest",
            email: order.email,

            items: orderItems,

            date: order.createdAt,
            status: order.status,

            totalAmount: order.totalAmount,
        };
    });
}

export async function getOrderStats() {
    const all = await db
        .select({ count: sql<number>`count(*)` })
        .from(Order);

    const pending = await db
        .select({ count: sql<number>`count(*)` })
        .from(Order)
        .where(eq(Order.status, "PENDING"));

    const shipped = await db
        .select({ count: sql<number>`count(*)` })
        .from(Order)
        .where(eq(Order.status, "SHIPPED"));

    return {
        totalOrders: Number(all[0]?.count),
        pending: Number(pending[0]?.count),
        shipped: Number(shipped[0]?.count),
    };
}


export async function getOrderById(id: string) {
    const [order] = await db
        .select()
        .from(Order)
        .where(eq(Order.id, id));

    if (!order) {
        throw new NotFoundException("Order not found");
    }

    const items = await db
        .select()
        .from(OrderItem)
        .where(eq(OrderItem.orderId, id));

    return {
        ...order,
        items,
    };
}


export async function getUserOrders(userId: string) {
    return await db
        .select()
        .from(Order)
        .where(eq(Order.userId, userId));
}

export async function deleteOrder(id: string) {
    const [order] = await db
        .delete(Order)
        .where(eq(Order.id, id))
        .returning();

    return order;
}