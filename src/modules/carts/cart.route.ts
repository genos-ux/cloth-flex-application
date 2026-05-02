import { Router } from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "./cart.controller";
import {ensureAuthenticated} from "../../middleware/auth.middleware.ts";
import {handler} from "../../utils/apiResponse.ts";


const cartRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management endpoints
 */


cartRoute.get("/", ensureAuthenticated, handler(getCart));

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 */

cartRoute.post("/", ensureAuthenticated, handler(addToCart));

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "2d31eee7-35a9-4814-b2e9-2d3ad0f57ee7"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *           example:
 *             productId: "2d31eee7-35a9-4814-b2e9-2d3ad0f57ee7"
 *             quantity: 2
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */


cartRoute.patch(
    "/items/:id",
    ensureAuthenticated,
    handler(updateCartItem)
);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "cart-item-uuid"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 5
 *           example:
 *             quantity: 5
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized
 */


cartRoute.delete(
    "/items/:id",
    ensureAuthenticated,
    handler(removeCartItem)
);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "cart-item-uuid"
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       403:
 *         description: Unauthorized access
 */

cartRoute.delete("/clear", ensureAuthenticated, handler(clearCart));

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */


export default cartRoute;