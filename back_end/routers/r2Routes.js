import express from "express";
import multer from "multer";

import {
  uploadSingle,
  uploadMultiple,
  deleteUpload,
} from "../controllers/r2Controller.js";

import {
  validateMultipleFileTypes,
  validateSingleFileType,
} from "../middleawre/validateFiletype.js";

const router = express.Router();

// IMPORTANT FIX
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

/**
 * SINGLE FILE
 */
router.post(
  "/single",
  upload.single("file"),
  validateSingleFileType,
  uploadSingle
);

/**
 * MULTIPLE FILES
 */
router.post(
  "/multiple",
  upload.array("files", 10),
  validateMultipleFileTypes,
  uploadMultiple
);

/**
 * DELETE FILE
 */
router.delete("/", deleteUpload);

export default router;