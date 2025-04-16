ALTER TABLE "required_file" RENAME TO "fileType";--> statement-breakpoint
ALTER TABLE "attestation" RENAME COLUMN "title" TO "fileName";--> statement-breakpoint
ALTER TABLE "attestation" RENAME COLUMN "url" TO "fileUrl";--> statement-breakpoint
ALTER TABLE "attestation" DROP CONSTRAINT "attestation_fileTypeId_required_file_id_fk";
--> statement-breakpoint
ALTER TABLE "attestation" ADD CONSTRAINT "attestation_fileTypeId_fileType_id_fk" FOREIGN KEY ("fileTypeId") REFERENCES "public"."fileType"("id") ON DELETE cascade ON UPDATE no action;
