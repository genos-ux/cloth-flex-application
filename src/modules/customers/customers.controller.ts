import type { Request, Response } from "express";

import { successResponse } from "../../utils/apiResponse";
import {getCustomers} from "./customers.service.ts";

export async function getCustomersHandler(
    req: Request,
    res: Response
) {
    const customers = await getCustomers();

    return successResponse(
        "Customers retrieved successfully",
        customers,
        200
    );
}