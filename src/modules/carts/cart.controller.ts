import type{ Request, Response } from "express";

import {
    addToCartSchema,
    updateCartItemSchema,
    cartItemParamsSchema,

} from "./cart.validation";

import {
    findUserCart,
    createCart,
    findProductById,
    findCartItem,
    createCartItem,
    updateCartItemQuantity,
    deleteCartItem,
    clearUserCart,
    incrementCartItem, getOrCreateCart
} from "./cart.service";
import {NotFoundException} from "../../utils/exception";
import {successResponse} from "../../utils/apiResponse.ts";


export async function getCart(
    req: Request,
    res: Response
) {
    try {
        const userId = (req as any).user.id;

        const cart = await findUserCart(userId);

        return res.status(200).json({
            message: "Cart retrieved successfully",
            data: cart,
        });
    } catch {
        return res.status(500).json({
            message: "Failed to get cart",
        });
    }
}

export async function addToCart(
    req: Request,
    res: Response
) {
    try {
        const parsed = addToCartSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten(),
            });
        }

        const { productId, quantity } = parsed.data;

        const userId = (req as any).user!.id;

        const product = await findProductById(productId);

        if (!product) {
            throw new NotFoundException("Product not found");
        }

        const cart = await getOrCreateCart(userId);

        const existingItem = await findCartItem(
            cart.id,
            productId
        );

        if (existingItem) {
            await incrementCartItem(
                existingItem.id,
                quantity
            );

            return successResponse("Cart item quantity updated",null, 200);
        }

        const item = await createCartItem(
            cart.id,
            productId,
            quantity
        );

        return successResponse("Item added to cart", item, 201);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to add item",
        });
    }
}

export async function updateCartItem(
    req: Request,
    res: Response
) {
    try {
        const params =
            cartItemParamsSchema.safeParse(
                req.params
            );

        if (!params.success) {
            return res.status(400).json({
                message: "Invalid ID",
            });
        }

        const body =
            updateCartItemSchema.safeParse(
                req.body
            );

        if (!body.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors:
                    body.error.flatten(),
            });
        }

        await updateCartItemQuantity(
            params.data.id,
            body.data.quantity
        );

        return res.status(200).json({
            message: "Cart item updated",
        });
    } catch {
        return res.status(500).json({
            message:
                "Failed to update cart item",
        });
    }
}


export async function removeCartItem(
    req: Request,
    res: Response
) {
    try {
        const params =
            cartItemParamsSchema.safeParse(
                req.params
            );

        if (!params.success) {
            return res.status(400).json({
                message: "Invalid ID",
            });
        }

        const cart = await getOrCreateCart(userId);

        const item = await findCartItemById(params.data.id);

        if (!item || item.cartId !== cart.id) {
            return res.status(403).json({
                message: "Unauthorized access to cart item",
            });
        }

        await deleteCartItem(
            params.data.id
        );

        return res.status(200).json({
            message:
                "Item removed from cart",
        });
    } catch {
        return res.status(500).json({
            message:
                "Failed to remove item",
        });
    }
}

/* -----------------------------
   CLEAR CART
------------------------------*/
export async function clearCart(
    req: Request,
    res: Response
) {
    try {
        const userId = (req as any).user.id;

        const cart =
            await findUserCart(userId);

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        await clearUserCart(cart.id);

        return res.status(200).json({
            message:
                "Cart cleared successfully",
        });
    } catch {
        return res.status(500).json({
            message:
                "Failed to clear cart",
        });
    }
}