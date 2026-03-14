import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getMyClassStudents,
  getAttendanceByDate,
  saveAttendance,
  getAttendanceHistory,
  getMyAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/my-class-students", protect, authorizeRoles("teacher"), getMyClassStudents);
router.get("/by-date", protect, authorizeRoles("teacher"), getAttendanceByDate);
router.post("/save", protect, authorizeRoles("teacher"), saveAttendance);
router.get("/history", protect, authorizeRoles("teacher"), getAttendanceHistory);

router.get("/me", protect, authorizeRoles("student", "parent"), getMyAttendance);

export default router;