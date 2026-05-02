import type { Request, Response } from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "./category.service.ts";

import {
    createCategorySchema,
    updateCategorySchema,
} from "./category.validation";
import {successResponse} from "../../utils/apiResponse.ts";

export async function createCategoryHandler(
    req: Request,
    res: Response
) {
    try {
        const validatedData =
            createCategorySchema.parse(req.body);

        const category =
            await createCategory(validatedData);

        return successResponse(
            "Category created successfully",
            category,
            201
        );
    } catch (error: any) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

export async function getAllCategoriesHandler(
    req: Request,
    res: Response
) {
    try {
        const categories =
            await getAllCategories();
        
        return successResponse("Categories retrieved successfully", categories, 200);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

export async function getCategoryByIdHandler(
    req: Request,
    res: Response
) {
    try {
        const id = req.params.id as string;

        const category =
            await getCategoryById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        return successResponse("Category retrieved successfully", category, 200);
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

export async function updateCategoryHandler(
    req: Request,
    res: Response
) {
    try {
        const id = req.params.id as string;

        const validatedData =
            updateCategorySchema.parse(req.body);

        const category =
            await updateCategory(id, validatedData);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        return res.status(200).json({
            message: "Category updated successfully",
            data: category,
        });
    } catch (error: any) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

export async function deleteCategoryHandler(
    req: Request,
    res: Response
) {
    try {
        const id = req.params.id as string;

        const category =
            await deleteCategory(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        return res.status(200).json({
            message: "Category deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
}