CREATE TYPE "public"."user_role" AS ENUM('admin', 'customer');--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "role" "user_role" DEFAULT 'customer' NOT NULL;