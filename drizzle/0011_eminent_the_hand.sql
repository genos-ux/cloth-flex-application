CREATE TYPE "public"."product_status" AS ENUM('IN_STOCK', 'LOW', 'CRITICAL', 'OUT_OF_STOCK');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "size" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "quantity" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "level" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" "product_status" DEFAULT 'OUT_OF_STOCK' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "in_stock";