CREATE TYPE "public"."role" AS ENUM('contractor', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'contractor';
