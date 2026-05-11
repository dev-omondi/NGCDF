// routes/upload.routes.js

import { Router } from "express";

import {
  uploadSingle as multerSingle,
  uploadMultiple as multerMultiple,
} from "../middleware/upload.js";

import {
  validateSingleFileType,
  validateMultipleFileTypes,
} from "../middleware/validateFileType.js";

import {
  uploadSingle,
  uploadMultiple,
  deleteUpload,
} from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/single",
  multerSingle.single("image"),
  validateSingleFileType,
  uploadSingle
);

router.post(
  "/multiple",
  multerMultiple.array("images", 10),
  validateMultipleFileTypes,
  uploadMultiple
);

// DELETE ROUTE
router.delete(
  "/:key",
  deleteUpload
);

export default router;