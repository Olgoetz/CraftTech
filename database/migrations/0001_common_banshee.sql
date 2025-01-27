CREATE TABLE "confirmation" (
	"userId" text NOT NULL,
	"dataPrivacy" boolean NOT NULL,
	"dataProcessing" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "confirmation" ADD CONSTRAINT "confirmation_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
