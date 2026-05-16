import { Router } from "express";
import { handler } from "../../utils/apiResponse";
import { ensureAuthenticated } from "../../middleware/auth.middleware";
import {
  initializePaymentHandler,
  verifyPaymentHandler,
  webhookHandler,
} from "./payment.controller";

const paymentRoute = Router();

/**
 * @swagger
 * /api/payments/initialize:
 *   post:
 *     summary: Initialize a Paystack payment for an order
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - email
 *             properties:
 *               orderId:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Payment initialized, returns authorization URL
 */
paymentRoute.post("/initialize", ensureAuthenticated, handler(initializePaymentHandler));

/**
 * @swagger
 * /api/payments/verify/{reference}:
 *   get:
 *     summary: Verify a Paystack payment by reference
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status returned
 */
paymentRoute.get("/verify/:reference", ensureAuthenticated, handler(verifyPaymentHandler));

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Paystack webhook endpoint (do not call manually)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook received
 */
// Webhook must receive raw body — no auth middleware
paymentRoute.post("/webhook", webhookHandler);

export default paymentRoute;
