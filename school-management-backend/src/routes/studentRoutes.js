import express from "express";
import {
  assignStudentToClass,
  getAllStudents,
  getStudentsByClass,
} from "../controllers/studentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


// Admin only - list all students with pagination + search + class filter
router.get(
  "/", 
  protect, 
  authorizeRoles("admin"), 
  getAllStudents
);

// Admin only
router.put(
  "/assign-class",
  protect,
  authorizeRoles("admin"),
  assignStudentToClass
);

// Admin + Teacher can view students
router.get(
  "/class/:classId",
  protect,
  authorizeRoles("admin", "teacher"),
  getStudentsByClass
);

export default router;