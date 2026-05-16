import { db } from "../../config/db";
import { User, Order } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function getCustomers() {
    const users = await db.select().from(User).where(eq(User.role, "customer"));
    const orders = await db.select().from(Order);

    return users.map((user) => {
        const userOrders = orders.filter(
            (o) => o.userId === user.id
        );

        const numberOfOrders = userOrders.length;

        const totalSpent = userOrders.reduce(
            (sum, o) => sum + Number(o.totalAmount),
            0
        );

        const lastOrder = userOrders
            .sort(
                (a, b) =>
                    new Date(b.createdAt!).getTime() -
                    new Date(a.createdAt!).getTime()
            )[0];

        return {
            id: user.id,
            customerName: user.name,
            email: user.email,

            numberOfOrders,
            totalSpent,

            lastOrder: lastOrder?.createdAt || null,

            status:
                lastOrder &&
                new Date(lastOrder.createdAt!).getTime() >
                Date.now() - 30 * 24 * 60 * 60 * 1000
                    ? "ACTIVE"
                    : "INACTIVE",
        };
    });
}