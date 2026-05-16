import type{ Request, Response } from "express";

import {
    addToCartSchema,
    updateCartItemSchema,
    cartItemParamsSchema,
} from "./cart.validation";

import {
    findUserCart,
    findProductById,
    findCartItem,
    createCartItem,
    updateCartItemQuantity,
    deleteCartItem,
    clearUserCart,
    getOrCreateCart
} from "./cart.service";
import { BadRequestException, NotFoundException, ForbiddenException } from "../../utils/exception";
import { successResponse } from "../../utils/apiResponse";
import { db } from "../../config/db";
import { CartItem, Product } from "../../db/schema";
import { eq } from "drizzle-orm";


export async function getCart(req: Request, res: Response) {
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

    return successResponse("Cart retrieved successfully", { ...cart, items }, 200);
}

export async function addToCart(req: Request, res: Response) {
    const parsed = addToCartSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new BadRequestException(parsed.error.issues[0]?.message ?? "Validation failed");
    }

    const { productId, quantity } = parsed.data;
    const userId = (req as any).user.id;

    const product = await findProductById(productId);
    if (!product) throw new NotFoundException("Product not found");

    if (product.quantity < quantity) throw new BadRequestException("Insufficient stock");

    const cart = await getOrCreateCart(userId);
    const existingItem = await findCartItem(cart.id, productId);

    if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (product.quantity < newQty) throw new BadRequestException("Exceeds available stock");
        await updateCartItemQuantity(existingItem.id, newQty);
        return successResponse("Cart updated", null, 200);
    }

    const item = await createCartItem(cart.id, productId, quantity);
    return successResponse("Item added to cart", item, 201);
}

export async function updateCartItem(req: Request, res: Response) {
    const params = cartItemParamsSchema.safeParse(req.params);
    if (!params.success) throw new BadRequestException("Invalid ID");

    const userId = (req as any).user.id;
    const cart = await getOrCreateCart(userId);

    const [item] = await db.select().from(CartItem).where(eq(CartItem.id, params.data.id));
    if (!item || item.cartId !== cart.id) throw new ForbiddenException("Unauthorized");

    const body = updateCartItemSchema.safeParse(req.body);
    if (!body.success) throw new BadRequestException(body.error.issues[0]?.message ?? "Validation failed");

    const product = await findProductById(item.productId);
    if (!product) throw new NotFoundException("Product not found");
    if (product.quantity < body.data.quantity) throw new BadRequestException("Exceeds available stock");

    await updateCartItemQuantity(params.data.id, body.data.quantity);
    return successResponse("Cart item updated", null, 200);
}

export async function removeCartItem(req: Request, res: Response) {
    const params = cartItemParamsSchema.safeParse(req.params);
    if (!params.success) throw new BadRequestException("Invalid ID");

    const userId = (req as any).user.id;
    const cart = await getOrCreateCart(userId);

    const [item] = await db.select().from(CartItem).where(eq(CartItem.id, params.data.id));
    if (!item || item.cartId !== cart.id) throw new ForbiddenException("Unauthorized access to cart item");

    await deleteCartItem(params.data.id);
    return successResponse("Item removed from cart", null, 200);
}

export async function clearCart(req: Request, res: Response) {
    const userId = (req as any).user.id;

    const cart = await findUserCart(userId);
    if (!cart) throw new NotFoundException("Cart not found");

    await clearUserCart(cart.id);
    return successResponse("Cart cleared successfully", null, 200);
}
