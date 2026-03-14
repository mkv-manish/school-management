import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import Student from "../models/Student.js";

import User from "../models/User.js";

const getTeacherId = (req) => String(req.user?.id || req.user?._id || "");

export const getMyClassStudents = async (req, res) => {
  try {
    const teacherId = getTeacherId(req);
    if (!teacherId) return res.status(401).json({ message: "Unauthorized" });

    const assignedClass = await Class.findOne({ classTeacher: teacherId });
    if (!assignedClass) {
      return res.status(404).json({ message: "No class assigned to you" });
    }

    const students = await Student.find({ classId: assignedClass._id })
      .populate("userId", "name email approved")
      .sort({ createdAt: -1 });

    return res.json({ class: assignedClass, students });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const getAttendanceByDate = async (req, res) => {
  try {
    const teacherId = getTeacherId(req);
    const { date } = req.query;

    if (!teacherId) return res.status(401).json({ message: "Unauthorized" });
    if (!date) return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });

    const assignedClass = await Class.findOne({ classTeacher: teacherId });
    if (!assignedClass) {
      return res.status(404).json({ message: "No class assigned to you" });
    }

    const attendance = await Attendance.findOne({
      classId: assignedClass._id,
      date: String(date),
    });

    return res.json({ class: assignedClass, attendance: attendance || null });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const saveAttendance = async (req, res) => {
  try {
    const teacherId = getTeacherId(req);
    const { date, records } = req.body;

    if (!teacherId) return res.status(401).json({ message: "Unauthorized" });
    if (!date) return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "records array required" });
    }

    const assignedClass = await Class.findOne({ classTeacher: teacherId });
    if (!assignedClass) {
      return res.status(404).json({ message: "No class assigned to you" });
    }

    // ✅ validate student belongs to assigned class
    const studentIds = records.map((r) => r.studentId);
    const validCount = await Student.countDocuments({
      _id: { $in: studentIds },
      classId: assignedClass._id,
    });

    if (validCount !== studentIds.length) {
      return res.status(400).json({ message: "Some students are not in your class" });
    }

    // ✅ normalize status values
    const normalized = records.map((r) => ({
      studentId: r.studentId,
      status: r.status === "absent" ? "absent" : "present",
    }));

    const updated = await Attendance.findOneAndUpdate(
      { classId: assignedClass._id, date: String(date) },
      {
        classId: assignedClass._id,
        date: String(date),
        markedBy: teacherId,
        records: normalized,
      },
      { upsert: true, new: true }
    );

    return res.json({ message: "Attendance saved", attendance: updated });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const teacherId = getTeacherId(req);
    if (!teacherId) return res.status(401).json({ message: "Unauthorized" });

    const assignedClass = await Class.findOne({ classTeacher: teacherId });
    if (!assignedClass) {
      return res.status(404).json({ message: "No class assigned to you" });
    }

    const history = await Attendance.find({ classId: assignedClass._id })
      .sort({ date: -1 })
      .limit(15);

    return res.json({ class: assignedClass, history });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    let student = null;

    if (req.user.role === "student") {
      student = await Student.findOne({ userId: req.user._id }).populate(
        "classId",
        "className section"
      );
    } else if (req.user.role === "parent") {
      student = await Student.findOne({ parentId: req.user._id }).populate(
        "classId",
        "className section"
      );
    }

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const attendanceDocs = await Attendance.find({
      classId: student.classId?._id || student.classId,
    }).sort({ date: -1 });

    const records = attendanceDocs
      .map((doc) => {
        const rec = doc.records.find(
          (r) => String(r.studentId) === String(student._id)
        );

        if (!rec) return null;

        return {
          _id: `${doc._id}-${student._id}`,
          attendanceId: doc._id,
          date: doc.date,
          status: rec.status,
        };
      })
      .filter(Boolean);

    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return res.json({
      student: {
        _id: student._id,
        classId: student.classId,
      },
      summary: {
        total,
        present,
        absent,
        percentage,
      },
      records,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};