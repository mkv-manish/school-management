import express from "express";
import {
  getPendingUsers,
  approveUser,
  getTeachers,
  getAdminAttendanceSummary,
  getAdminAttendanceClassDetails,
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all pending users (Admin only)
router.get(
  "/pending-users",
  protect,
  authorizeRoles("admin"),
  getPendingUsers
);

// Approve user (Admin only)
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("admin"),
  approveUser
);

router.get(
  "/teachers",
  protect,
  authorizeRoles("admin"),
  getTeachers
);

router.get(
  "/attendance",
  protect,
  authorizeRoles("admin"),
  getAdminAttendanceSummary
);

router.get(
  "/attendance/class/:classId",
  protect,
  authorizeRoles("admin"),
  getAdminAttendanceClassDetails
);

export default router;