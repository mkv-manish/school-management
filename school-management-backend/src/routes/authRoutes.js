import express from "express";
import { registerStudent,
  registerTeacher,
  registerAdmin,
  loginUser, } from "../controllers/authController.js";

const router = express.Router();

// one-time admin setup
router.post("/register-admin", registerAdmin);

// self registrations
router.post("/register-student", registerStudent);
router.post("/register-teacher", registerTeacher);

// login (all roles)
router.post("/login", loginUser);

export default router;