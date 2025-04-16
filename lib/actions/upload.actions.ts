"use server";

import { db } from "@/database/drizzle";
import config from "../config";
import {
  createPresignedDeleteURL,
  createPresignedGetURL,
  createPresignedPutURL,
} from "../s3";
import { logger } from "../utils";
import { attestations, fileTypes } from "@/database/schema";
import { auth } from "@/auth";
import { and, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { log } from "console";
import { lookup } from "dns";
import { getAuthenticatedUserId } from "../auth";

/**
 * Generates a pre-signed S3 URL for downloading a file belonging to the authenticated user.
 *
 * This function verifies that a user is logged in, retrieves their user ID,
 * and constructs the S3 object key by prefixing the provided file name with the user ID.
 * It then returns a time-limited pre-signed URL that can be used to securely download the file.
 *
 * @param fileName - The name of the file stored in the user's S3 folder (e.g., "report.pdf").
 * @returns A pre-signed URL string to download the file from S3.
 * @throws If the user is not authenticated.
 */
export const getPresignedUrl = async (fileName: string) => {
  logger("info", "Getting presigned url for file", fileName);

  const userId = await getAuthenticatedUserId();
  console.log("userId", userId);
  const preSignedURL = await createPresignedGetURL({
    bucket: config.fileStorage.bucketName,
    key: `${userId}/${fileName}`,
  });
  logger("info", "Presigned url", preSignedURL);
  return preSignedURL;
};

export const deleteFile = async (fileName: string) => {
  logger("info", "Deleting file", fileName);
  const userId = await getAuthenticatedUserId();
  const preSignedURL = await createPresignedDeleteURL({
    bucket: config.fileStorage.bucketName,
    key: `${userId}/${fileName}`,
  });
  const result = await fetch(preSignedURL, {
    method: "DELETE",
  });
  logger("info", "File delete finished", preSignedURL.split("?")[0]);
  if (!result.ok) {
    logger("error", "Failed to delete file", result);
    throw new Error("Failed to delete file");
  }
  const response = await db
    .delete(attestations)
    .where(
      and(eq(attestations.userId, userId), eq(attestations.fileName, fileName))
    );
  console.log("response", response);

  if (!response) {
    logger("error", "Failed to delete file from database", response);
    throw new Error("Failed to delete file from database");
  }
  logger("info", "File deleted", fileName);
  revalidatePath("/mein-profil");
};

export const uploadFile = async (file: File, fileType: string) => {
  logger("info", "Uploading file", file.name);

  const session = await auth();

  if (!session) {
    throw new Error("User not logged in");
  }
  const userId = session.user?.id as string;

  const preSignedURL = await createPresignedPutURL({
    bucket: config.fileStorage.bucketName,
    key: `${userId}/${file.name}`,
    contentType: file.type,
  });
  const result = await fetch(preSignedURL, {
    method: "PUT",
    body: file,
  });

  logger("info", "File upload finished", preSignedURL.split("?")[0]);

  if (!result.ok) {
    console.log("result", result);
    logger("error", "Failed to upload file", await result.text());
    throw new Error("Failed to upload file");
  }
  await upsertFile({ fileName: file.name, fileType, fileUrl: preSignedURL });
  revalidatePath("/mein-profil");
};

export const downloadFile = async (fileName: string) => {
  logger("info", "Downloading file", fileName);

  const session = await auth();

  if (!session) {
    throw new Error("User not logged in");
  }
  const userId = session.user?.id as string;

  try {
    const preSignedURL = await createPresignedGetURL({
      bucket: config.fileStorage.bucketName,
      key: `${userId}/${fileName}`,
    });
    const response = await fetch(preSignedURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

export const showFile = async (fileName: string) => {
  logger("info", "Getting file with presigned url");
  try {
    const key = fileName;
    const preSignedURL = await createPresignedGetURL({
      bucket: config.fileStorage.bucketName,
      key,
    });
    const result = await fetch(preSignedURL, {
      method: "GET",
    });

    logger("info", "File url", preSignedURL);

    if (!result.ok) {
      logger("error", "Failed to get file", result);
      return { success: false, error: "Failed to get file" };
    }
    return { success: true, url: preSignedURL };
  } catch (error: any) {
    logger("error", "Failed to get file", error);
    return { success: false, error: error.message };
  }
};

export const renderFile = async (title: string) => {
  logger("info", "Rendering file");

  const file = await getFile(title);
  if (file.length === 0) {
    logger("info", "File not found");
    return { success: false };
  }

  try {
    const key = file[0].fileName as string;
    const preSignedURL = await createPresignedGetURL({
      bucket: config.fileStorage.bucketName,
      key,
    });
    const result = await fetch(preSignedURL, {
      method: "GET",
    });

    logger("info", "File url", preSignedURL);

    if (!result.ok) {
      logger("error", "Failed to get file", result);
      return { success: false, error: "Failed to get file" };
    }
    return { success: true, url: preSignedURL };
  } catch (error: any) {
    logger("error", "Failed to get file", error);
    return { success: false, error: error.message };
  }
};

type UpsertData = {
  fileName: string;
  fileUrl: string;
  fileType: string;
};

export const upsertFile = async ({
  fileName,
  fileType,
  fileUrl,
}: UpsertData) => {
  logger("info", "Upserting file", fileName);
  const session = await auth();
  if (!session?.user) {
    throw new Error("User not logged in");
  }

  const user = session.user;

  logger("info", "Getting filetype id for: ", fileType);

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
    logger("info", "File already exists, Updating");
    await db
      .update(attestations)
      .set({
        fileName,
        fileUrl,
      })
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
      fileUrl,
      fileTypeId: fileTypeId[0].id as string,
    });
  }
  // .onConflictDoUpdate({
  //   target: [attestations.userId, attestations.fileTypeId], // Ensures update if fileType exists
  //   set: {
  //     fileName,
  //     fileUrl,
  //     updatedAt: new Date(),
  //   },
  // });
  log("info", "File uploaded");
};

export const getFile = async (fileType: string) => {
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

  console.log(fileTypeId);

  const result = await db
    .select()
    .from(attestations)
    .orderBy(desc(attestations.createdAt))
    .where(
      and(
        eq(attestations.userId, user.id as string),
        eq(attestations.fileTypeId, fileTypeId[0].id as string)
      )
    )
    .limit(1);
  console.log(result);
  return result;
};

export const getAttestations = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("User not logged in");
  }

  const user = session.user;

  // const files = await db
  //   .select()
  //   .from(attestations)
  //   .where(eq(attestations.userId, user.id as string))
  //   .leftJoin(fileTypes, eq(attestations.fileTypeId, fileTypes.id));

  const files = await db
    .select()
    .from(fileTypes)
    .leftJoin(
      attestations,
      and(
        eq(fileTypes.id, attestations.fileTypeId),
        eq(attestations.userId, user.id as string)
      )
    );
  console.log("files", files);
  return files;
};
