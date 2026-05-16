import { Router } from "express";

import {
    createOrderHandler,
    getAllOrdersHandler,
    getOrderByIdHandler,
    getUserOrdersHandler,
    deleteOrderHandler,
    getOrderStatsHandler,
} from "./order.controller";

import {
    ensureAuthenticated,
    isAdmin,
} from "../../middleware/auth.middleware";
import {handler} from "../../utils/apiResponse.ts";

const orderRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (guest or authenticated user)
 *     tags: [Orders]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - items
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-1234-5678-9101-abcdef123456"
 *
 *               guestId:
 *                 type: string
 *                 example: "guest-123456"
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "customer@example.com"
 *
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                       example: "11111111-2222-3333-4444-555555555555"
 *
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *
 *     responses:
 *       201:
 *         description: Order created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       500:
 *         description: Server error
 */
orderRoute.post("/",ensureAuthenticated, handler(createOrderHandler));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: List of orders
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 */
orderRoute.get(
    "/",
    ensureAuthenticated,
    isAdmin,
    handler(getAllOrdersHandler)
);

/**
 * @swagger
 * /api/orders/stats:
 *   get:
 *     summary: Get order statistics for dashboard
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Order stats retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Order stats retrieved successfully
 *               data:
 *                 totalOrders: 120
 *                 pending: 10
 *                 shipped: 80
 *                 returned: 5
 */
orderRoute.get(
    "/stats",
    ensureAuthenticated,
    isAdmin,
    handler(getOrderStatsHandler)
);

/**
 * @swagger
 * /api/orders/user:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: User orders retrieved
 *
 *       401:
 *         description: Unauthorized
 */
orderRoute.get(
    "/user",
    ensureAuthenticated,
    handler(getUserOrdersHandler)
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *
 *       404:
 *         description: Order not found
 *
 *       401:
 *         description: Unauthorized
 */
orderRoute.get(
    "/:id",
    ensureAuthenticated,
    handler(getOrderByIdHandler)
);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *
 *       404:
 *         description: Order not found
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 */
orderRoute.delete(
    "/:id",
    ensureAuthenticated,
    isAdmin,
    handler(deleteOrderHandler)
);

export default orderRoute;