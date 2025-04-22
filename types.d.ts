import { users, attestations, additionalFiles } from "@/database/schema";

// Define the User type based on the users table
export type User = typeof users.$inferSelect;

// Define the Attestation type based on the attestations table
export type Attestation = typeof attestations.$inferSelect;

// Define the AdditionalFile type based on the additionalFiles table
export type AdditionalFile = typeof additionalFiles.$inferSelect;

export interface ConfirmationsProps {
  dataPrivacy: boolean;
  dataProcessing: boolean;
}

type AttestationWithFileType = {
  attestation: Attestation | null;
  fileType: {
    id: string;
    name: string;
  } | null;
};

export type ProfileProps = {
  user: User;
  street?: string;
  zipCode?: string;
  city?: string;
  phone?: string;
  attestations: AttestationWithFileType[];
  additionalFiles?: AdditionalFile[];
};

export type UserObject = {
  id: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin" | "guest";
  image: string | null;
  emailVerified?: Date | null;
  createdAt: Date | null;
  updatedAt: Date;

  attestations?: Attestation[];
  additionalFiles?: AdditionalFile[];
};
