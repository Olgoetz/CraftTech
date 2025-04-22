ALTER TABLE "profile" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "updatedAt" timestamp NOT NULL DEFAULT now();
