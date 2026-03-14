import express from "express";
import {
  addResult,
  getResultByStudent,
  getMyResult,
} from "../controllers/resultController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Teacher only
router.post(
  "/add",
  protect,
  authorizeRoles("teacher"),
  addResult
);

// Admin + Teacher + Student
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getResultByStudent
);

// Student + Parent self result
router.get(
  "/me",
  protect,
  authorizeRoles("student", "parent"),
  getMyResult
);

export default router;