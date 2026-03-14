import User from "../models/User.js";
import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";
import Result from "../models/Result.js";
import Fee from "../models/Fee.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalParents = await User.countDocuments({ role: "parent" });
    const totalClasses = await Class.countDocuments();
    const totalResults = await Result.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: today },
    });

    const fees = await Fee.find().select("totalAmount paidAmount status");

    const totalFeeRecords = fees.length;
    const totalCollected = fees.reduce(
      (sum, row) => sum + Number(row.paidAmount || 0),
      0
    );
    const totalFeeAmount = fees.reduce(
      (sum, row) => sum + Number(row.totalAmount || 0),
      0
    );
    const totalDue = totalFeeAmount - totalCollected;
    const unpaidFeeCount = fees.filter((f) => f.status === "unpaid").length;
    const partialFeeCount = fees.filter((f) => f.status === "partial").length;

    return res.json({
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      todayAttendance,
      totalResults,
      totalFeeRecords,
      totalCollected,
      totalDue,
      unpaidFeeCount,
      partialFeeCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};