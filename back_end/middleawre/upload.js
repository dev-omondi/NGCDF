// utils/uploadToR2.js
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import r2 from "../config/r2.js";

// ── Cached constants (read once at startup, not on every request) ──────────
const R2_BUCKET = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

if (!R2_BUCKET)     throw new Error("Missing env: R2_BUCKET_NAME");
if (!R2_PUBLIC_URL) throw new Error("Missing env: R2_PUBLIC_URL");
// ──────────────────────────────────────────────────────────────────────────

// Never trust the original filename extension — derive it from the real MIME type
const MIME_TO_EXT = {
  "image/png":  "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif":  "gif",
};

const getPublicUrl = (key) => `${R2_PUBLIC_URL}/${key}`;

// ── Retry helper (handles transient R2 errors / network blips) ─────────────
const uploadWithRetry = async (fn, retries = 3, delay = 300) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      // Exponential backoff: 300ms → 600ms → 900ms
      await new Promise((res) => setTimeout(res, delay * attempt));
    }
  }
};
// ──────────────────────────────────────────────────────────────────────────

/**
 * Upload a single file to R2.
 * @param {Express.Multer.File} file   - The file object from multer (req.file)
 * @param {string}              folder - Destination folder in the bucket (e.g. "avatars")
 * @returns {Promise<{ url: string, key: string }>}
 */
export const uploadSingleToR2 = async (file, folder = "general") => {
  const ext = MIME_TO_EXT[file.mimetype] ?? "bin";
  const key = `${folder}/${uuidv4()}.${ext}`;

  try {
    await uploadWithRetry(() =>
      r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          // "inline" renders in the browser instead of forcing a download
          ContentDisposition: "inline",
          // Tell browsers + CDNs to cache the file for 1 year.
          // "immutable" means: don't revalidate — the file will never change
          // (safe because every upload gets a unique UUID key)
          CacheControl: "public, max-age=31536000, immutable",
        })
      )
    );
  } catch (err) {
    throw new Error(`R2 upload failed: ${err.message}`);
  }

  return {
    url: getPublicUrl(key),
    key, // store in DB — needed to delete the file later
  };
};

/**
 * Upload multiple files to R2 concurrently with:
 *  - a concurrency cap to prevent memory exhaustion under high traffic
 *  - automatic rollback if any file fails mid-batch
 *
 * @param {Express.Multer.File[]} files       - Array of file objects (req.files)
 * @param {string}                folder      - Destination folder in the bucket
 * @param {number}                concurrency - Max simultaneous uploads (default: 4)
 * @returns {Promise<Array<{ url: string, key: string }>>}
 */
export const uploadMultipleToR2 = async (
  files,
  folder = "general",
  concurrency = 4
) => {
  const results = [];
  const uploaded = []; // track successful uploads so we can roll back on failure

  try {
    for (let i = 0; i < files.length; i += concurrency) {
      const chunk = files.slice(i, i + concurrency);

      const chunkResults = await Promise.all(
        chunk.map((file) => uploadSingleToR2(file, folder))
      );

      uploaded.push(...chunkResults);
      results.push(...chunkResults);
    }
  } catch (err) {
    // One file failed — delete every file that already made it to R2
    // allSettled so a failed delete doesn't mask the original error
    await Promise.allSettled(uploaded.map((f) => deleteFromR2(f.key)));
    throw new Error(`Upload failed, all changes rolled back: ${err.message}`);
  }

  return results;
};

/**
 * Delete a file from R2 by its key.
 * @param {string} key - The file's key (path inside the bucket)
 * @returns {Promise<void>}
 */
export const deleteFromR2 = async (key) => {
  if (!key || typeof key !== "string") {
    throw new Error("deleteFromR2: a valid key string is required");
  }

  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );
  } catch (err) {
    throw new Error(`R2 delete failed: ${err.message}`);
  }
};
