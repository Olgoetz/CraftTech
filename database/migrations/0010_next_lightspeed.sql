ALTER TABLE "profile" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "updatedAt" SET NOT NULL;
