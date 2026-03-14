import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
} from "../controllers/feeStructureController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getFeeStructures);
router.post("/", protect, authorizeRoles("admin"), createFeeStructure);
router.put("/:id", protect, authorizeRoles("admin"), updateFeeStructure);
router.delete("/:id", protect, authorizeRoles("admin"), deleteFeeStructure);

export default router;