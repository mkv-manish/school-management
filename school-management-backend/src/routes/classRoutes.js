import express from "express";
import { createClass,
  getClasses,
  updateClass,
  deleteClass,
  assignClassTeacher,
  getAllClasses} from "../controllers/classController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only
// http://localhost:5000/api/classes
router.post("/", protect, authorizeRoles("admin"), createClass);

// Admin + Teacher can view
router.get("/", getAllClasses);
router.get("/all", protect, authorizeRoles("admin", "teacher", "student", "parent"), getClasses);
router.put("/:id", protect, authorizeRoles("admin"), updateClass);
router.delete("/:id", protect, authorizeRoles("admin"), deleteClass);

// Assign teacher
router.put("/:id/assign-teacher", protect, authorizeRoles("admin"), assignClassTeacher);


export default router;