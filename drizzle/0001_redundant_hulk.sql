ALTER TABLE "auth_users" RENAME TO "User";--> statement-breakpoint
ALTER TABLE "User" DROP CONSTRAINT "auth_users_email_unique";--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");