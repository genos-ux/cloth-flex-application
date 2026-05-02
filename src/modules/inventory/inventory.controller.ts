import type { Request, Response } from "express";
import { getInventory } from "./inventory.service";
import { successResponse } from "../../utils/apiResponse";

export async function getInventoryHandler(req: Request, res: Response) {
    const products = await getInventory();

    const totalSkus = products.length;

    const inStock = products.filter(
        (p) => p.status === "IN_STOCK"
    ).length;

    const lowStock = products.filter(
        (p) => p.status === "LOW"
    ).length;

    const outOfStock = products.filter(
        (p) => p.status === "OUT_OF_STOCK"
    ).length;

    const inventoryTable = products.map((p) => ({
        sku: p.sku,
        name: p.name,
        size: p.size,
        category: p.category,
        level: p.level,
        status: p.status,
    }));

    return successResponse(
        "Inventory retrieved successfully",
        {
            stats: {
                totalSkus,
                inStock,
                lowStock,
                outOfStock,
            },
            products: inventoryTable,
        },
        200
    );
}