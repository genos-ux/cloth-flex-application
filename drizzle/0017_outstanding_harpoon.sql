CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'SUCCESS', 'FAILED');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reference" varchar(255) NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"paystack_response" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;