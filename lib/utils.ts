import { auth } from "@/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createPresignedDeleteURL } from "./s3";

/**
 * Merges class names using clsx and tailwind-merge.
 * @param inputs - Class names to merge.
 * @returns A single merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first letter of a word.
 * @param word - The word to capitalize.
 * @returns The capitalized word.
 */
export const capitalized = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Delays execution for a specified number of milliseconds.
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the delay.
 */
export const waitor = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Logs messages with different levels and optionally sends them to an external logging service.
 * @param level - The log level (info, warn, debug, error).
 * @param message - The log message.
 * @param data - Optional additional data to log.
 * @param metadata - Optional metadata for the log entry.
 */
export const logger = (
  level: "info" | "warn" | "debug" | "error",
  message: string,
  data?: any,
  metadata?: Record<string, any>
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    data: data || null,
    metadata: metadata || null,
  };

  // Log to console
  if (process.env.NODE_ENV === "development" || level === "error") {
    console.log(JSON.stringify(logEntry, null, 2));
  }

  // Optionally send to an external logging service
  if (process.env.LOGGING_SERVICE_URL) {
    fetch(process.env.LOGGING_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry),
    }).catch((err) => console.error("Failed to send log to service:", err));
  }
};

/**
 * Splits a presigned URL into its base URL, query parameters, and file name.
 * @param url - The presigned URL to split.
 * @returns An object containing the base URL, query parameters, and file name.
 */
export const splitPresignedUrl = (url: string) => {
  const splitUrl = url.split("?");
  const fileName = splitUrl[0].split("/").pop();
  return {
    url: splitUrl[0],
    query: splitUrl[1],
    fileName,
  };
};

/**
 * Custom error class for application-specific errors.
 */
export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  /**
   * Creates an instance of AppError.
   * @param message - The error message.
   * @param statusCode - The HTTP status code (default: 500).
   * @param details - Optional additional error details.
   */
  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    // Capture the stack trace (excluding the constructor call from it)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Creates a standardized error response object.
 * @param error - The AppError instance.
 * @returns An object containing error details.
 */
export const createErrorResponse = (error: AppError) => {
  return {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    details: error.details || null,
  };
};

/**
 * Deletes a file from S3 and its corresponding database entry.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The key of the file in the S3 bucket.
 * @param deleteQuery - A function to execute the database deletion query.
 * @throws AppError if the file or database entry cannot be deleted.
 */
export const deleteFileFromS3andDb = async ({
  bucketName,
  key,
  deleteQuery,
}: {
  bucketName: string;
  key: string;
  deleteQuery: () => Promise<any>;
}) => {
  logger("info", "Deleting file", key);

  const preSignedURL = await createPresignedDeleteURL({
    bucket: bucketName,
    key,
  });

  const result = await fetch(preSignedURL, { method: "DELETE" });

  if (!result.ok) {
    logger("error", "Failed to delete file", await result.text());
    throw new AppError("Failed to delete file", 400);
  }

  try {
    await deleteQuery();
  } catch (error) {
    logger("error", "Failed to delete file from database", error);
    throw new AppError("Failed to delete file fromdatabase", 500, error);
  }
};
