import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createFee,
  getAllFees,
  getMyFees,
  updateFee,
  deleteFee,
  addFeePayment,
  createFeesForClass,
  generateFeesFromStructure,
} from "../controllers/feeController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createFee);

router.get("/", protect, authorizeRoles("admin"), getAllFees);

router.get("/my", protect, authorizeRoles("student", "parent"), getMyFees);

router.put("/:id", protect, authorizeRoles("admin"), updateFee);

router.delete("/:id", protect, authorizeRoles("admin"), deleteFee);

router.post("/:id/payment", protect, authorizeRoles("admin"), addFeePayment);

router.post("/bulk/class", protect, authorizeRoles("admin"), createFeesForClass);

router.post(
  "/generate/from-structure",
  protect,
  authorizeRoles("admin"),
  generateFeesFromStructure
);

export default router;