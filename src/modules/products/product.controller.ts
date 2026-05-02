// import type { Request, Response } from "express";
// import {errorResponse, successResponse} from "../../utils/apiResponse";
// import { BadRequestException } from "../../utils/exception";
// import { createProductSchema } from "./product.validation";
// import {
//     createProduct,
//     getAllProducts,
//     getProductById,
//     updateProduct,
//     deleteProduct,
// } from "./product.service";
// import {db} from "../../config/db.ts";
// import {Product} from "../../db/schema.ts";
//
//
// export const addProduct = async (req: Request, res: Response) => {
//     // Validate body
//     const parsed = createProductSchema.safeParse(req.body);
//
//     if (!parsed.success) {
//         // @ts-ignore
//         throw new BadRequestException(parsed.error.issues[0].message
//         );
//     }
//
//     // Validate files
//     const files = req.files as Express.Multer.File[];
//
//     if (!files || files.length === 0) {
//         throw new BadRequestException(
//             "At least one image is required"
//         );
//     }
//
//     // Extract Cloudinary URLs
//     const imageUrls = files.map(
//         (file) => file.path
//     );
//
//     const product = await db
//         .insert(Product)
//         .values({
//             ...parsed.data,
//
//             price: parsed.data.price.toString(),
//             images: imageUrls,
//         })
//         .returning();
//
//     return successResponse(
//         "Product created successfully",
//         product,
//         201
//     );
// };
//
//
// export async function listProducts(req: Request, res: Response) {
//     const products = await getAllProducts();
//     //return res.json(successResponse("Products retrieved", products));
//     return successResponse("Products retrieved successfully", products, 200);
// }
//
// export async function getProduct(req: Request, res: Response) {
//     const {id} = req.params;
//
//     if(!id) throw new BadRequestException('Product id is required');
//
//     const product = await getProductById(req.params.id as string);
//     if (!product) throw new BadRequestException("Product not found");
//     //return res.json(successResponse("Product retrieved", product));
//
//     return successResponse("Product retrieved successfully", product);
//
// }
//
// export async function update(req: Request, res: Response) {
//     const product = await updateProduct(req.params.id as string, req.body);
//     return successResponse("Product updated successfully", product);
// }
//
//
// export async function removeProduct(req: Request, res: Response) {
//     const result = await deleteProduct(req.params.id as string);
//     return successResponse("Product removed successfully", result);
// }


import type { Request, Response } from "express";
import { BadRequestException } from "../../utils/exception";
import { createProductSchema } from "./product.validation";

import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct, addMultipleImages,
} from "./product.service";

import { successResponse } from "../../utils/apiResponse";
import cloudinary from "../../config/cloudinary.ts";


export const addProduct = async (req: Request, res: Response) => {
    const parsed = createProductSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new Error(
            parsed.error?.issues?.[0]?.message || "Invalid request"
        );
    }

    const product = await createProduct({
        ...parsed.data,
        images: [],
    });

    return successResponse("Product created successfully", product, 201);
};

/* -----------------------------
   LIST PRODUCTS
------------------------------*/
export async function listProducts(
    req: Request,
    res: Response
) {
    const products = await getAllProducts();

    return successResponse(
        "Products retrieved successfully",
        products,
        200
    );
}


export async function uploadProductImages(req: Request, res: Response) {
    const  productId  = req.params.productId as string;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        throw new BadRequestException("At least one image is required");
    }

    const uploadPromises = files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "clothflex/products",
        });

        return result.secure_url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    const result = await addMultipleImages(
        productId,
        imageUrls
    );

    return res.json(result);
}

/* -----------------------------
   GET PRODUCT
------------------------------*/
export async function getProduct(
    req: Request,
    res: Response
) {
    const id = req.params.id as string;

    if (!id)
        throw new BadRequestException(
            "Product id is required"
        );

    const product = await getProductById(id);

    return successResponse(
        "Product retrieved successfully",
        product,
        200
    );
}

/* -----------------------------
   UPDATE PRODUCT
------------------------------*/
export async function update(
    req: Request,
    res: Response
) {
    const id = req.params.id as string;

    const product = await updateProduct(
        id,
        req.body
    );

    return successResponse(
        "Product updated successfully",
        product,
        200
    );
}

/* -----------------------------
   DELETE PRODUCT
------------------------------*/
export async function removeProduct(
    req: Request,
    res: Response
) {
    const id  = req.params.id as string;

    const result = await deleteProduct(id);

    return successResponse(
        "Product removed successfully",
        result,
        200
    );
}