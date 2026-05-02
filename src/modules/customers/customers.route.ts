import {Router} from "express";
import {ensureAuthenticated, isAdmin} from "../../middleware/auth.middleware.ts";
import {handler} from "../../utils/apiResponse.ts";
import {getCustomersHandler} from "./customers.controller.ts";


const customerRoute = Router();


/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers with analytics
 *     tags: [Customers]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Customers retrieved successfully
 *               data:
 *                 - id: "uuid"
 *                   customerName: "Gabriel"
 *                   email: "gabriel@email.com"
 *                   numberOfOrders: 5
 *                   totalSpent: 750
 *                   lastOrder: "2026-05-01T10:00:00.000Z"
 *                   status: "ACTIVE"
 */
customerRoute.get(
    "/",
    ensureAuthenticated,
    isAdmin,
    handler(getCustomersHandler)
);


export default customerRoute;