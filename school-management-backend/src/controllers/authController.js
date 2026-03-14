import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";

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

    // Check if student already exists
    const existingStudent = await User.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Check if parent already exists
    let parentUser = await User.findOne({ email: parentEmail });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student user
    const studentUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      approved: false,
    });

    // If parent not exists → create
    if (!parentUser) {
      const parentPassword = await bcrypt.hash("parent123", 10);

      parentUser = await User.create({
        name: fatherName,
        email: parentEmail,
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
      fatherName,
      motherName,
      contactNumber,
      address,
      parentId: parentUser._id,
    });

    res.status(201).json({
      message: "Student registered successfully. Await admin approval.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const teacherUser = await User.create({
      name,
      email,
      password: hashed,
      role: "teacher",
      approved: false, // admin approval
    });

    // optional teacher profile doc
    await Teacher.create({
      userId: teacherUser._id,
      qualification,
      experienceYears,
      subjectSpeciality,
      contactNumber,
      address,
      profileBio,
    });

    return res.status(201).json({
      message: "Teacher registered. Await admin approval.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};