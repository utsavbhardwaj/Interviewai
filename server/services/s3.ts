import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

// Determine if AWS S3 is fully configured
const isS3Configured = !!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_S3_BUCKET);

let s3Client: S3Client | null = null;
if (isS3Configured) {
  s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Uploads a file to AWS S3 (or falls back to local disk storage if AWS keys are not configured).
 * Returns the public URL or local relative path of the uploaded file.
 */
export async function uploadToS3(
  file: Express.Multer.File,
  folder: string
): Promise<string> {
  const fileExt = file.originalname.split(".").pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  if (isS3Configured && s3Client) {
    try {
      console.log(`[S3] Uploading ${file.originalname} to bucket ${AWS_S3_BUCKET}...`);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${filename}`;
    } catch (error) {
      console.error("[S3] AWS S3 upload failed, falling back to local storage:", error);
    }
  }

  // Local storage fallback
  console.log(`[S3] S3 not configured or failed. Saving ${file.originalname} locally...`);
  const uploadsDir = path.resolve("uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const localFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const localFilePath = path.join(uploadsDir, localFilename);
  await fs.promises.writeFile(localFilePath, file.buffer);

  // Return a local static path
  return `/uploads/${localFilename}`;
}
