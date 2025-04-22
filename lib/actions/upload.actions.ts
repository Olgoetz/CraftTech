"use server";

import { db } from "@/database/drizzle";
import config from "../config";
import {
  createPresignedDeleteURL,
  createPresignedGetURL,
  createPresignedPutURL,
} from "../s3";
import {
  logger,
  AppError,
  createErrorResponse,
  waitor,
  deleteFileFromS3andDb,
} from "../utils";
import { additionalFiles, attestations, fileTypes } from "@/database/schema";
import { auth } from "@/auth";
import { and, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUserId, getRole } from "../auth";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { Attestation } from "@/types";
import { headers } from "next/headers";

/**
 * Generates a pre-signed S3 URL for downloading a file belonging to the authenticated user.
 *
 * This function verifies that a user is logged in, retrieves their user ID,
 * and constructs the S3 object key by prefixing the provided file name with the user ID.
 * It then returns a time-limited pre-signed URL that can be used to securely download the file.
 *
 * @param fileName - The name of the file stored in the user's S3 folder (e.g., "report.pdf").
 * @param someUserId - Only possible if user is admin. This is the ID of some arbitrary user.
 * @returns A pre-signed URL string to download the file from S3.
 * @throws If the user is not authenticated.
 */
export const downloadFile = async (fileName: string, someUserId?: string) => {
  logger("info", "Getting presigned url for file", fileName);

  const isAdmin = (await getRole()) === "admin";
  let userId;
  if (isAdmin && someUserId) {
    userId = someUserId;
  } else {
    userId = await getAuthenticatedUserId();
  }

  const preSignedURL = await createPresignedGetURL({
    bucket: config.fileStorage.bucketName,
    key: `${userId}/${fileName}`,
  });
  logger("info", "Presigned url", preSignedURL);
  return preSignedURL;
};

const dbTableMap = {
  attestations: attestations,
  additionalFiles: additionalFiles,
};

export const deleteFileFromProfile = async (
  fileId: string,
  fileName: string,
  table: string
) => {
  const userId = await getAuthenticatedUserId();
  await deleteFileFromS3andDb({
    bucketName: config.fileStorage.bucketName,
    key: `${userId}/${fileName}`,
    deleteQuery: async () => {
      const tableName = dbTableMap[table as keyof typeof dbTableMap];

      return db
        .delete(tableName)
        .where(and(eq(tableName.userId, userId), eq(tableName.id, fileId)));
    },
  });
  revalidatePath("/mein-profil");
};

/**
 * Deletes a file from S3 and the database.
 *
 * This function generates a pre-signed URL for deleting the file from S3,
 * performs the deletion, and then removes the corresponding record from the database.
 *
 * @param fileId - The id of the file to be deleted.
 * @param fileName - The name of the file to be deleted.
 * @throws If the deletion from S3 or the database fails.
 * @returns void
 */
export const deleteFile = async (fileName: string, fileId: string) => {
  logger("info", "Deleting file", fileName);
  const userId = await getAuthenticatedUserId();

  const preSignedURL = await createPresignedDeleteURL({
    bucket: config.fileStorage.bucketName,
    key: `${userId}/${fileName}`,
  });

  const result = await fetch(preSignedURL, { method: "DELETE" });

  if (!result.ok) {
    logger("error", "Failed to delete file", result);
    throw new Error("Failed to delete file");
  }

  const deleteQuery = db
    .delete(attestations)
    .where(and(eq(attestations.userId, userId), eq(attestations.id, fileId)));

  const response = await deleteQuery;

  if (!response) {
    logger("error", "Failed to delete file from database", response);
    throw new Error("Failed to delete file from database");
  }

  logger("info", "File deleted", fileName);
  revalidatePath("/mein-profil");
};

export const uploadFile = async (file: File) => {
  logger("info", "Uploading file", file.name);
  const userId = await getAuthenticatedUserId();
  const preSignedURL = await createPresignedPutURL({
    bucket: config.fileStorage.bucketName,
    key: `${userId}/${file.name}`,
    contentType: file.type,
  });

  const result = await fetch(preSignedURL, { method: "PUT", body: file });

  if (!result.ok) {
    logger("error", "Failed to upload file", await result.text());
    throw new AppError("Failed to upload file", 400);
  }

  try {
    await db.insert(additionalFiles).values({
      userId: userId,
      fileName: file.name,
    });
  } catch (error) {
    logger("error", "Failed to upload file to database", error);
    throw new AppError("Failed to upload file to database", 500, error);
  }
  revalidatePath("/mein-profil");
};

export const uploadAttestation = async (file: File, fileType: string) => {
  logger("info", "Uploading file", file.name);

  const userId = await getAuthenticatedUserId();

  const preSignedURL = await createPresignedPutURL({
    bucket: config.fileStorage.bucketName,
    key: `${userId}/${file.name}`,
    contentType: file.type,
  });

  const result = await fetch(preSignedURL, { method: "PUT", body: file });

  if (!result.ok) {
    logger("error", "Failed to upload file", await result.text());
    throw new Error("Failed to upload file");
  }

  await upsertAttestation({
    fileName: file.name,
    fileType,
  });
  revalidatePath("/mein-profil");
};

type UpsertData = {
  fileName: string;

  fileType: string;
};

export const upsertAttestation = async ({ fileName, fileType }: UpsertData) => {
  logger("info", "Upserting file", fileName);

  const session = await auth();
  if (!session?.user) {
    throw new Error("User not logged in");
  }

  const user = session.user;
  const fileTypeId = await db
    .select()
    .from(fileTypes)
    .where(eq(fileTypes.name, fileType))
    .limit(1);

  const attestation = await db
    .select()
    .from(attestations)
    .where(eq(attestations.fileTypeId, fileTypeId[0].id));

  if (attestation.length > 0) {
    await db
      .update(attestations)
      .set({ fileName })
      .where(
        and(
          eq(attestations.userId, user.id as string),
          eq(attestations.fileTypeId, fileTypeId[0].id as string)
        )
      );
  } else {
    await db.insert(attestations).values({
      userId: user.id as string,
      fileName,

      fileTypeId: fileTypeId[0].id as string,
    });
  }

  logger("info", "File upserted");
};

// export const getFile = async (fileType: string) => {
//   const session = await auth();
//   if (!session?.user) {
//     throw new Error("User not logged in");
//   }

//   const user = session.user;
//   const fileTypeId = await db
//     .select()
//     .from(fileTypes)
//     .where(eq(fileTypes.name, fileType))
//     .limit(1);

//   const result = await db
//     .select()
//     .from(attestations)
//     .orderBy(desc(attestations.createdAt))
//     .where(
//       and(
//         eq(attestations.userId, user.id as string),
//         eq(attestations.fileTypeId, fileTypeId[0].id as string)
//       )
//     )
//     .limit(1);

//   return result;
// };

export const getAttestations = async () => {
  const userId = await getAuthenticatedUserId();

  const result = await db
    .select()
    .from(attestations)
    //.where(eq(attestations.userId, userId));
    .fullJoin(
      fileTypes,
      and(
        eq(fileTypes.id, attestations.fileTypeId),
        eq(attestations.userId, userId as string)
      )
    );

  return result;
};

export const getAdditionalFiles = async () => {
  const userId = await getAuthenticatedUserId();

  const files = await db
    .select()
    .from(additionalFiles)
    .where(eq(additionalFiles.userId, userId));

  return files;
};
