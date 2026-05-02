import { Router } from "express";

import {
    listProducts,
    getProduct,
    addProduct,
    update,
    removeProduct, uploadProductImages,
} from "./product.controller";

import {
    ensureAuthenticated,
    isAdmin,
} from "../../middleware/auth.middleware.ts";

import { upload } from "../../middleware/upload_image.middleware.ts";
import { handler } from "../../utils/apiResponse.ts";

const productRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/* =========================================================
   GET ALL PRODUCTS
========================================================= */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Products retrieved successfully
 *               data: []
 */
productRoute.get(
    "/",
    ensureAuthenticated,
    handler(listProducts)
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Product retrieved successfully
 *               data:
 *                 id: "uuid"
 *                 name: "Premium Hoodie"
 *                 price: "150.00"
 *                 quantity: 10
 *                 status: "IN_STOCK"
 *                 level: 100
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Product not found
 */
productRoute.get(
    "/:id",
    ensureAuthenticated,
    handler(getProduct)
);


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categoryId
 *               - size
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Hoodie
 *               description:
 *                 type: string
 *                 example: High-quality cotton hoodie
 *               price:
 *                 type: number
 *                 example: 150
 *               categoryId:
 *                 type: string
 *                 example: "uuid"
 *               size:
 *                 type: string
 *                 example: "XL"
 *               quantity:
 *                 type: integer
 *                 example: 12
 *
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Product created successfully
 *               data:
 *                 id: "uuid"
 *                 name: "Premium Hoodie"
 *                 price: "150.00"
 *                 quantity: 12
 *                 status: "IN_STOCK"
 *                 level: 100
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
productRoute.post(
    "/",
    ensureAuthenticated,
    isAdmin,
    handler(addProduct)
);

/**
 * @swagger
 * /api/products/{productId}/images:
 *   post:
 *     summary: Upload product images
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 */
productRoute.post(
    "/:productId/images",
    ensureAuthenticated,
    isAdmin,
    upload.array("images", 5),
    handler(uploadProductImages)
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               size:
 *                 type: string
 *               quantity:
 *                 type: integer
 *
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Product updated successfully
 *               data:
 *                 id: "uuid"
 *                 name: "Updated Hoodie"
 *                 quantity: 8
 *                 status: "LOW"
 *                 level: 40
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error
 */
productRoute.patch(
    "/:id",
    ensureAuthenticated,
    isAdmin,
    handler(update)
);

/* =========================================================
   DELETE PRODUCT
========================================================= */
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Product removed successfully
 *       404:
 *         description: Product not found
 */
productRoute.delete(
    "/:id",
    ensureAuthenticated,
    isAdmin,
    handler(removeProduct)
);

export default productRoute;