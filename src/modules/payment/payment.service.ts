import { db } from "../../config/db";
import { Order, Payment } from "../../db/schema";
import { eq } from "drizzle-orm";
import { BadRequestException, NotFoundException } from "../../utils/exception";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE = "https://api.paystack.co";

export async function initializePayment(orderId: string, email: string) {
  const [order] = await db.select().from(Order).where(eq(Order.id, orderId));

  if (!order) throw new NotFoundException("Order not found");

  if (order.status !== "PENDING") {
    throw new BadRequestException("Order is not in a payable state");
  }

  const amountInKobo = Math.round(Number(order.totalAmount) * 100);

  const reference = `CF-${orderId}-${Date.now()}`;

  const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      reference,
      metadata: { orderId },
    }),
  });

  const result = (await response.json()) as any;

  if (!result.status) {
    throw new BadRequestException(result.message || "Payment initialization failed");
  }

  await db.insert(Payment).values({
    orderId,
    email,
    amount: order.totalAmount,
    reference,
    status: "PENDING",
  });

  return {
    authorizationUrl: result.data.authorization_url,
    reference: result.data.reference,
  };
}

export async function verifyPayment(reference: string) {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });

  const result = (await response.json()) as any;

  if (!result.status) {
    throw new BadRequestException(result.message || "Verification failed");
  }

  const [payment] = await db
    .select()
    .from(Payment)
    .where(eq(Payment.reference, reference));

  if (!payment) throw new NotFoundException("Payment record not found");

  const paystackStatus = result.data.status;
  const newStatus = paystackStatus === "success" ? "SUCCESS" : "FAILED";

  await db
    .update(Payment)
    .set({ status: newStatus, paystackResponse: result.data })
    .where(eq(Payment.reference, reference));

  if (newStatus === "SUCCESS") {
    await db
      .update(Order)
      .set({ status: "PAID" })
      .where(eq(Order.id, payment.orderId));
  }

  return { status: newStatus, orderId: payment.orderId };
}

export async function handleWebhook(payload: any, signature: string) {
  const crypto = await import("crypto");

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");

  if (hash !== signature) {
    throw new BadRequestException("Invalid webhook signature");
  }

  if (payload.event === "charge.success") {
    const reference = payload.data?.reference;
    if (reference) {
      await verifyPayment(reference);
    }
  }
}
