import {
  users,
  attestations,
  additionalFiles,
  fileTypes,
} from "@/database/schema";
import { AppError, logger } from "../utils";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
export const getAllUsers = async () => {
  try {
    const results = await db
      .select()
      .from(users)
      .leftJoin(attestations, eq(attestations.userId, users.id))
      .leftJoin(fileTypes, eq(attestations.fileTypeId, fileTypes.id))
      .leftJoin(additionalFiles, eq(additionalFiles.userId, users.id));

    const usersMap = new Map();

    for (const row of results) {
      const { user, attestation, fileType, additionalFile } = row;

      if (!usersMap.has(user.id)) {
        usersMap.set(user.id, {
          ...user,
          attestations: [],
          additionalFiles: [],
        });
      }

      const currentUser = usersMap.get(user.id);

      // Deduplicate attestation
      if (
        attestation?.id &&
        !currentUser.attestations.some((a: any) => a.id === attestation.id)
      ) {
        currentUser.attestations.push({
          ...attestation,
          fileType: fileType ?? null,
        });
      }

      // Deduplicate additionalFile
      if (
        additionalFile?.id &&
        !currentUser.additionalFiles.some(
          (f: any) => f.id === additionalFile.id
        )
      ) {
        currentUser.additionalFiles.push(additionalFile);
      }
    }

    const usersWithEverything = Array.from(usersMap.values());

    console.log(usersWithEverything);
    return usersWithEverything;
  } catch (error) {
    logger("error", "Failed to get users with files", error);
    throw new AppError("Failed to get users with files", 500, error);
  }
};
