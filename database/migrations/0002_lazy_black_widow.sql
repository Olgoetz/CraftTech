ALTER TABLE "attestation" ALTER COLUMN "updatedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "attestation" ALTER COLUMN "updatedAt" SET NOT NULL;
