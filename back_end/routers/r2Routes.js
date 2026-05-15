import express from "express";
import multer from "multer";
import {
  uploadSingle,
  uploadMultiple,
  deleteUpload,
} from "../controllers/r2Controller.js";
import { validateMultipleFileTypes,validateSingleFileType } from "../middleawre/validateFiletype.js";
const router = express.Router();

// Multer - memory storage only (files go straight to R2, never touch disk)
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB per file
    files: 10,                   // max 10 files at once
  },
});

/**
 * @route   POST /api/upload/single
 * @desc    Upload a single file to R2
 * @access  Private
 * @field   file (form-data)
 */
router
  .route("/single")
  .post(upload.single("file"), validateSingleFileType, uploadSingle);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple files to R2 (max 10)
 * @access  Private
 * @field   files (form-data)
 */
router
  .route("/multiple")
  .post(upload.array("files", 10), validateMultipleFileTypes, uploadMultiple);

/**
 * @route   DELETE /api/upload?key=folder/filename.jpg
 * @desc    Delete a file from R2 by its key
 * @access  Private
 */
router.route("/").delete(deleteUpload);

export default router;