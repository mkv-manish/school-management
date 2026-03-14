import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getTeacherDashboard } from "../controllers/teacherController.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("teacher"),
  getTeacherDashboard
);

export default router;