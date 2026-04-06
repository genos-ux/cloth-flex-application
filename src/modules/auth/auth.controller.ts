import type { Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse"


export const login = async(req: Request, res: Response) => {
    //return successResponse("Login successful", null);

    return res.status(200).json(successResponse("Login successful", null));
}