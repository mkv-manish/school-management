import express from "express";
import {
  createNotice,
  getNotices,
  deleteNotice,
} from "../controllers/noticeController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadNoticeImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  (req, res, next) => {
    uploadNoticeImage(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message || "Image upload failed",
        });
      }
      next();
    });
  },
  createNotice
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "teacher", "student", "parent"),
  getNotices
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteNotice
);

export default router;