ALTER TABLE "User" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "User_email_unique";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");