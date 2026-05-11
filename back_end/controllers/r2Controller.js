// controllers/upload.controller.js

import {
  uploadSingleToR2,
  uploadMultipleToR2,
  deleteFromR2,
} from "../services/r2.service.js";

/**
 * POST /upload/single
 * Handles single image upload to R2.
 */
export const uploadSingle = async (req, res) => {
  try {
    const folder = req.query.folder || "general";

    const { url, key } =
      await uploadSingleToR2(
        req.file,
        folder
      );

    return res.status(200).json({
      success: true,
      url,
      key,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /upload/multiple
 * Handles multiple image uploads to R2.
 */
export const uploadMultiple = async (req, res) => {
  try {

    const folder =
      req.query.folder || "general";

    const results =
      await uploadMultipleToR2(
        req.files,
        folder
      );

    return res.status(200).json({
      success: true,
      count: results.length,
      files: results,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * DELETE /upload?key=projects/abc.jpg
 * Deletes a file from R2.
 */
export const deleteUpload = async (req, res) => {
  try {

    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "File key is required",
      });
    }

    await deleteFromR2(key);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};