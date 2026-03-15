import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";

export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      classId,
      fatherName,
      motherName,
      parentEmail,
      contactNumber,
      address,
    } = req.body;

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedFatherName = fatherName?.trim();
    const trimmedMotherName = motherName?.trim();
    const trimmedParentEmail = parentEmail?.trim().toLowerCase();
    const trimmedContactNumber = contactNumber?.trim() || "";
    const trimmedAddress = address?.trim() || "";

    if (
      !trimmedName ||
      !trimmedEmail ||
      !password ||
      !classId ||
      !trimmedFatherName ||
      !trimmedMotherName ||
      !trimmedParentEmail
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Invalid student email",
      });
    }

    if (!emailRegex.test(trimmedParentEmail)) {
      return res.status(400).json({
        message: "Invalid parent email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (trimmedContactNumber && !/^\d{10}$/.test(trimmedContactNumber)) {
      return res.status(400).json({
        message: "Contact number must be exactly 10 digits",
      });
    }

    // Check if student already exists
    const existingStudent = await User.findOne({ email: trimmedEmail });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Check if parent already exists
    let parentUser = await User.findOne({ email: trimmedParentEmail });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student user
    const studentUser = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: "student",
      approved: false,
    });

    try {
      // If parent not exists → create
      if (!parentUser) {
        const parentPassword = await bcrypt.hash("parent123", 10);

        parentUser = await User.create({
          name: trimmedFatherName,
          email: trimmedParentEmail,
          password: parentPassword,
          role: "parent",
          approved: false,
          parentOf: studentUser._id,
        });
      }

      // Create student document
      await Student.create({
        userId: studentUser._id,
        classId,
        fatherName: trimmedFatherName,
        motherName: trimmedMotherName,
        contactNumber: trimmedContactNumber,
        address: trimmedAddress,
        parentId: parentUser._id,
      });
    } catch (profileError) {
      await User.findByIdAndDelete(studentUser._id);
      throw profileError;
    }

    return res.status(201).json({
      message: "Student registered successfully. Await admin approval.",
    });
  } catch (error) {
    console.error("registerStudent error:", error);
    return res.status(500).json({ error: error.message });
  }
};


// LOGIN (all roles)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("login", email)

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // approval check (admin ko optionally bypass kara sakte ho)
    if (user.role !== "admin" && !user.approved) {
      return res.status(403).json({ message: "Account awaiting admin approval" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN SIGNUP (one-time setup)
 * If an admin already exists, block it.
 */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, setupKey } = req.body;

    // optional: setupKey security (recommended)
    if (process.env.ADMIN_SETUP_KEY && setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Invalid setup key" });
    }

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
      approved: true, // admin auto-approved
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * TEACHER SIGNUP (self-register)
 * approved=false (admin approval required)
 */
export const registerTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      qualification,
      experienceYears,
      subjectSpeciality,
      contactNumber,
      address,
      profileBio,
    } = req.body;

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedQualification = qualification?.trim() || "";
    const trimmedSubjectSpeciality = subjectSpeciality?.trim() || "";
    const trimmedContactNumber = contactNumber?.trim() || "";
    const trimmedAddress = address?.trim() || "";
    const trimmedProfileBio = profileBio?.trim() || "";

    if (!trimmedName || !trimmedEmail || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    if (trimmedContactNumber && !/^\d{10}$/.test(trimmedContactNumber)) {
      return res.status(400).json({
        message: "Contact number must be exactly 10 digits",
      });
    }

    let parsedExperienceYears = 0;
    if (
      experienceYears !== undefined &&
      experienceYears !== null &&
      experienceYears !== ""
    ) {
      parsedExperienceYears = Number(experienceYears);

      if (Number.isNaN(parsedExperienceYears) || parsedExperienceYears < 0) {
        return res.status(400).json({
          message: "Experience years must be a valid non-negative number",
        });
      }
    }

    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const teacherUser = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashed,
      role: "teacher",
      approved: false,
    });

    try {
      await Teacher.create({
        userId: teacherUser._id,
        qualification: trimmedQualification,
        experienceYears: parsedExperienceYears,
        subjectSpeciality: trimmedSubjectSpeciality,
        contactNumber: trimmedContactNumber,
        address: trimmedAddress,
        profileBio: trimmedProfileBio,
      });
    } catch (profileError) {
      await User.findByIdAndDelete(teacherUser._id);
      throw profileError;
    }

    return res.status(201).json({
      message: "Teacher registered. Await admin approval.",
    });
  } catch (error) {
    console.error("registerTeacher error:", error);
    return res.status(500).json({
      message: "Teacher registration failed",
      error: error.message,
    });
  }
};