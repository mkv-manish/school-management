import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./src/routes/adminRoutes.js";
import classRoutes from "./src/routes/classRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import resultRoutes from "./src/routes/resultRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import noticeRoutes from "./src/routes/noticeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import teacherRoutes from "./src/routes/teacherRoutes.js";
import homeworkRoutes from "./src/routes/homeworkRoutes.js";
import feeRoutes from "./src/routes/feeRoutes.js";
import feeTypeRoutes from "./src/routes/feeTypeRoutes.js";
import feeStructureRoutes from "./src/routes/feeStructureRoutes.js";



dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/fee-types", feeTypeRoutes);
app.use("/api/fee-structures", feeStructureRoutes);

// Root Route 👇
app.get("/", (req, res) => {
  res.send("School Management API Running ✅");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});