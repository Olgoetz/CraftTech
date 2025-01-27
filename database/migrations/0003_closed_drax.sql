ALTER TABLE "confirmation" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "confirmation_user_id_unique" ON "confirmation" USING btree ("userId");--> statement-breakpoint
ALTER TABLE "confirmation" ADD CONSTRAINT "confirmation_id_unique" UNIQUE("id");
