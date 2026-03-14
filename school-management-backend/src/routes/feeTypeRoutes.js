import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createFeeType,
  getFeeTypes,
  updateFeeType,
  deleteFeeType,
} from "../controllers/feeTypeController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getFeeTypes);
router.post("/", protect, authorizeRoles("admin"), createFeeType);
router.put("/:id", protect, authorizeRoles("admin"), updateFeeType);
router.delete("/:id", protect, authorizeRoles("admin"), deleteFeeType);

export default router;