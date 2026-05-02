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
    getOrCreateCart
} from "./cart.service";
import {BadRequestException, NotFoundException} from "../../utils/exception";
import {successResponse} from "../../utils/apiResponse.ts";
import {db} from "../../config/db.ts";
import {CartItem, Product} from "../../db/schema.ts";
import {eq} from "drizzle-orm";


export async function getCart(
    req: Request,
    res: Response
) {
    try {
        const userId = (req as any).user.id;

        const cart = await getOrCreateCart(userId);

        const items = await db
            .select({
                id: CartItem.id,
                quantity: CartItem.quantity,
                productId: Product.id,
                name: Product.name,
                price: Product.price,
                images: Product.images,
            })
            .from(CartItem)
            .leftJoin(Product, eq(CartItem.productId, Product.id))
            .where(eq(CartItem.cartId, cart.id));

        return successResponse("Cart retrieved successfully", {
            ...cart,
            items,
        }, 200);
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
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

        if (product.quantity < quantity) {
            throw new BadRequestException("Insufficient stock");
        }

        const cart = await getOrCreateCart(userId);

        const existingItem = await findCartItem(cart.id, productId);

        if (existingItem) {
            const newQty = existingItem.quantity + quantity;

            if (product.quantity < newQty) {
                throw new BadRequestException("Exceeds available stock");
            }

            await updateCartItemQuantity(existingItem.id, newQty);

            return successResponse("Cart updated", null, 200);
        }

        const item = await createCartItem(
            cart.id,
            productId,
            quantity
        );

        return successResponse("Item added to cart", item, 201);
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
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

        const userId = (req as any).user.id;
        const cart = await getOrCreateCart(userId);

        const item = await db
            .select()
            .from(CartItem)
            .where(eq(CartItem.id, params.data.id))
            .then(res => res[0]);

        if (!item || item.cartId !== cart.id) {
            return res.status(403).json({
                message: "Unauthorized",
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

        const product = await findProductById(item.productId);

        if (!product) throw new NotFoundException("Product not found");

        if (product.quantity < body.data.quantity) {
            throw new BadRequestException("Exceeds available stock");
        }

        await updateCartItemQuantity(
            params.data.id,
            body.data.quantity
        );

        return res.status(200).json({
            message: "Cart item updated",
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
        });
    }
}


export async function removeCartItem(
    req: Request,
    res: Response
) {
    try {
        const userId = (req as any).user.id as string;
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

        const item = await db
            .select()
            .from(CartItem)
            .where(eq(CartItem.id, params.data.id))
            .then(res => res[0]);

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
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
        });
    }
}


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
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong",
        });
    }
}