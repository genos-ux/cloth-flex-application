import type { Request, Response } from "express";
import { successResponse } from "../../utils/apiResponse";
import { BadRequestException } from "../../utils/exception";
import { initializePayment, verifyPayment, handleWebhook } from "./payment.service";

export async function initializePaymentHandler(req: Request, res: Response) {
  const { orderId, email } = req.body;

  if (!orderId || !email) {
    throw new BadRequestException("orderId and email are required");
  }

  const data = await initializePayment(orderId, email);

  return successResponse("Payment initialized", data, 200);
}

export async function verifyPaymentHandler(req: Request, res: Response) {
  const { reference } = req.params;

  const data = await verifyPayment(reference);

  return successResponse("Payment verified", data, 200);
}

export async function webhookHandler(req: Request, res: Response) {
  const signature = req.headers["x-paystack-signature"] as string;

  await handleWebhook(req.body, signature);

  // Paystack expects a 200 response quickly
  return res.sendStatus(200);
}
