import { Router } from "express";

import {
    createCategoryHandler,
    getAllCategoriesHandler,
    getCategoryByIdHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
} from "./category.controller";
import {handler} from "../../utils/apiResponse.ts";
import {ensureAuthenticated, isAdmin} from "../../middleware/auth.middleware.ts";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "c1c9c0a1-3d2b-4a5a-9b1c-123456789abc"
 *
 *         name:
 *           type: string
 *           example: "Men Clothing"
 *
 *         isVisible:
 *           type: boolean
 *           example: true
 *
 *         productsCount:
 *           type: integer
 *           minimum: 0
 *           example: 10
 *
 *         createdAt:
 *           type: string
 *           example: "2026-01-01T12:00:00.000Z"
 *
 *         updatedAt:
 *           type: string
 *           example: "2026-01-01T12:00:00.000Z"
 *
 *
 *     CreateCategoryInput:
 *       type: object
 *       required:
 *         - name
 *
 *       properties:
 *
 *         name:
 *           type: string
 *           example: "Women Clothing"
 *
 *         isVisible:
 *           type: boolean
 *           example: true
 *
 *         productsCount:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *
 *
 *     UpdateCategoryInput:
 *       type: object
 *
 *       properties:
 *
 *         name:
 *           type: string
 *           example: "Electronics"
 *
 *         isVisible:
 *           type: boolean
 *           example: false
 *
 *         productsCount:
 *           type: integer
 *           minimum: 0
 *           example: 25
 */




/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Category created successfully
 *               data:
 *                 id: "uuid"
 *                 name: "Shoes"
 *                 isVisible: true
 *                 productsCount: 0
 *
 *       400:
 *         description: Validation error
 */
router.post(
    "/",
    ensureAuthenticated,
    isAdmin,
    handler(createCategoryHandler)
);




/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: "uuid"
 *                   name: "Men Clothing"
 *                   isVisible: true
 *                   productsCount: 12
 */
router.get(
    "/",
    ensureAuthenticated,
    handler(getAllCategoriesHandler)
);




/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "uuid"
 *
 *     responses:
 *       200:
 *         description: Category found
 *
 *       404:
 *         description: Category not found
 */
router.get(
    "/:id",
    ensureAuthenticated,
    handler(getCategoryByIdHandler)
);




/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Update category
 *     tags: [Categories]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "uuid"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryInput'
 *
 *     responses:
 *       200:
 *         description: Category updated successfully
 *
 *       404:
 *         description: Category not found
 */
router.patch(
    "/:id",
    ensureAuthenticated,
    isAdmin,
    handler(updateCategoryHandler)
);




/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "uuid"
 *
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *
 *       404:
 *         description: Category not found
 */
router.delete(
    "/:id",
    ensureAuthenticated,
    isAdmin,
    handler(deleteCategoryHandler)
);

export default router;