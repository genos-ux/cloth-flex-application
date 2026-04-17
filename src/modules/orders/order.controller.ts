import type{ Request, Response } from "express";
import { createOrderSchema } from "./order.validation";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    getUserOrders,
    deleteOrder,
} from "./orders.service.ts";
import {BadRequestException, NotFoundException} from "../../utils/exception";
import {successResponse} from "../../utils/apiResponse.ts";


export const createOrderHandler = async (req: Request, res: Response) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
        const errorMessage =
            parsed.error.issues?.[0]?.message || "Validation failed";

        throw new BadRequestException(errorMessage);
    }

    const order = await createOrder(parsed.data);

    return successResponse("Order created successfully", order, 201);
};


export const getAllOrdersHandler = async (req: Request, res: Response) => {
    const orders = await getAllOrders();

    return successResponse("Order retrieved successfully", orders, 200);
};


export const getOrderByIdHandler = async (req: Request, res: Response) => {
    const order = await getOrderById(req.params.id as string);

    if (!order) {
        throw new NotFoundException("Order not found");
    }

    return successResponse("Order retrieved successfully", order, 200);
};

/* ---------------- USER ORDERS ---------------- */
export const getUserOrdersHandler = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const orders = await getUserOrders(userId);

    if(!orders) throw new NotFoundException("Order not found");

    return successResponse("User's order retrieved successfully", orders, 200);
};


export const deleteOrderHandler = async (req: Request, res: Response) => {
    const order = await deleteOrder(req.params.id as string);

    if (!order) {
        throw new BadRequestException("Order not found");
    }

    return successResponse("Order deleted successfully", null, 204);
};