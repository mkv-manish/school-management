import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { homeworkUpload } from "../middleware/uploadHomework.js";
import { uploadSubmission } from "../middleware/uploadSubmission.js";

import {
  createHomework,
  getTeacherHomework,
  getHomeworkByClass,
  deleteHomework,
  getMyHomework,
  submitHomework,
  getHomeworkSubmissions,
} from "../controllers/homeworkController.js";

const router = express.Router();

// teacher create (pdf upload optional)
router.post(
  "/teacher",
  protect,
  authorizeRoles("teacher"),
  homeworkUpload.single("file"),
  createHomework
);

router.get("/teacher", protect, authorizeRoles("teacher"), getTeacherHomework);

router.delete("/teacher/:id", protect, authorizeRoles("teacher"), deleteHomework);

// student/parent -> get own class homework
router.get("/my", protect, authorizeRoles("student", "parent"), getMyHomework);

// generic (admin/teacher/student/parent)
router.get(
  "/",
  protect,
  authorizeRoles("admin", "teacher", "student", "parent"),
  getHomeworkByClass
);

// student submit homework
router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  uploadSubmission.single("file"),
  submitHomework
);

// teacher view submissions
router.get(
  "/submissions/:homeworkId",
  protect,
  authorizeRoles("teacher"),
  getHomeworkSubmissions
);

export default router;