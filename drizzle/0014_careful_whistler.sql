ALTER TABLE "products" ADD COLUMN "sku" varchar(50);--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sku_unique" UNIQUE("sku");