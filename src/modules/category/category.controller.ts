import type { Request, Response } from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "./category.service";
import { createCategorySchema, updateCategorySchema } from "./category.validation";
import { successResponse } from "../../utils/apiResponse";
import { BadRequestException, NotFoundException } from "../../utils/exception";

export async function createCategoryHandler(req: Request, res: Response) {
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestException(parsed.error.issues[0]?.message ?? "Validation failed");

    const category = await createCategory(parsed.data);
    return successResponse("Category created successfully", category, 201);
}

export async function getAllCategoriesHandler(req: Request, res: Response) {
    const categories = await getAllCategories();
    return successResponse("Categories retrieved successfully", categories, 200);
}

export async function getCategoryByIdHandler(req: Request, res: Response) {
    const category = await getCategoryById(req.params.id);
    if (!category) throw new NotFoundException("Category not found");
    return successResponse("Category retrieved successfully", category, 200);
}

export async function updateCategoryHandler(req: Request, res: Response) {
    const parsed = updateCategorySchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestException(parsed.error.issues[0]?.message ?? "Validation failed");

    const category = await updateCategory(req.params.id, parsed.data);
    if (!category) throw new NotFoundException("Category not found");
    return successResponse("Category updated successfully", category, 200);
}

export async function deleteCategoryHandler(req: Request, res: Response) {
    const category = await deleteCategory(req.params.id);
    if (!category) throw new NotFoundException("Category not found");
    return successResponse("Category deleted successfully", category, 200);
}
