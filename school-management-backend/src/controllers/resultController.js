import Result from "../models/Result.js";
import Student from "../models/Student.js";

// Add Marks (Teacher only)
export const addResult = async (req, res) => {
  try {
    const {
      studentId,
      classId,
      subject,
      marksObtained,
      totalMarks,
      examType,
    } = req.body;

    const result = await Result.create({
      studentId,
      classId,
      subject,
      marksObtained,
      totalMarks,
      examType,
      addedBy: req.user._id,
    });

    res.status(201).json({
      message: "Marks added successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get result by student
export const getResultByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "student") {
      const ownStudent = await Student.findOne({ userId: req.user._id });
      if (!ownStudent || String(ownStudent._id) !== String(studentId)) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const results = await Result.find({ studentId })
      .populate("studentId")
      .populate("classId", "className section")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyResult = async (req, res) => {
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

    const results = await Result.find({ studentId: student._id })
      .populate("classId", "className section")
      .sort({ createdAt: -1 });

    return res.json({
      student: {
        _id: student._id,
        classId: student.classId,
      },
      results,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};