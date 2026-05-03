CREATE TYPE "public"."gender" AS ENUM('MEN', 'WOMEN', 'UNISEX');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "gender" "gender" DEFAULT 'UNISEX' NOT NULL;