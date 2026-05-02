import {Router} from "express";
import {ensureAuthenticated, isAdmin} from "../../middleware/auth.middleware.ts";
import {handler} from "../../utils/apiResponse.ts";
import {getInventory} from "./inventory.service.ts";
import {getInventoryHandler} from "./inventory.controller.ts";


const inventoryRoute = Router();

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get inventory dashboard (table + stats)
 *     tags: [Inventory]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Inventory retrieved successfully
 *               data:
 *                 stats:
 *                   totalSkus: 10
 *                   inStock: 6
 *                   lowStock: 2
 *                   outOfStock: 2
 *                 products:
 *                   - sku: "CFX-HOOD-A1B2"
 *                     name: "Hoodie"
 *                     size: "XL"
 *                     category: "Hoodies"
 *                     level: 100
 *                     status: "IN_STOCK"
 */
inventoryRoute.get(
    "/",
    ensureAuthenticated,
    isAdmin,
    handler(getInventoryHandler),
);


export default inventoryRoute;