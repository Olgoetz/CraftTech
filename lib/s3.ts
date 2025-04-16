import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "./config";

interface PreSignedURLProps {
  bucket: string;
  key: string;
  contentType?: string;
}

const REGION = config.fileStorage.region;

// Reuse the S3 client instance
const s3Client = new S3Client({ region: REGION });

export const createPresignedPutURL = ({
  bucket,
  key,
  contentType,
}: PreSignedURLProps) => {
  // Expires in 15 minutes.
  const expiresIn = 15 * 60;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Creates a pre-signed URL to retrieve a file from an S3 bucket using a given object key.
 *
 * The generated URL is valid for a limited duration and allows secure, time-limited
 * access to the specified object without requiring AWS credentials on the client side.
 *
 * @param bucket - The name of the S3 bucket where the object is stored.
 * @param key - The full path (object key) of the file within the bucket.
 * @returns A Promise that resolves to a pre-signed URL string.
 */
export const createPresignedGetURL = ({
  bucket,
  key,
}: PreSignedURLProps): Promise<string> => {
  // Expires in 24 hours.
  const expiresIn = 60;
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    // ResponseContentDisposition: "inline",
  });
  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Creates a pre-signed URL to delete a file from an S3 bucket using a given object key.
 *
 * The generated URL is valid for a limited duration and allows secure, time-limited
 * access to the specified object without requiring AWS credentials on the client side.
 *
 * @param bucket - The name of the S3 bucket where the object is stored.
 * @param key - The full path (object key) of the file within the bucket.
 * @returns A Promise that resolves to a pre-signed URL string.
 */

export const createPresignedDeleteURL = ({
  bucket,
  key,
}: PreSignedURLProps): Promise<string> => {
  const expiresIn = 60;
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
};
