// middleware/validateFileType.js
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

// Validates a single file buffer against real magic bytes (not just claimed MIME type)
const validateBuffer = async (buffer, fieldname) => {
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIMES.includes(detected.mime)) {
    throw new Error(
      `File "${fieldname}" has an invalid type. Only images are allowed.`
    );
  }
  return detected.mime; // return real mime type
};

// Middleware for single file upload (req.file)
export const validateSingleFileType = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const realMime = await validateBuffer(req.file.buffer, req.file.fieldname);
    req.file.mimetype = realMime; // override with real mime

    next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Middleware for multiple file uploads (req.files)
export const validateMultipleFileTypes = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    // Validate all files in parallel
    await Promise.all(
      files.map(async (file) => {
        const realMime = await validateBuffer(file.buffer, file.fieldname);
        file.mimetype = realMime; // override with real mime
      })
    );

    next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
