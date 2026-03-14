import Homework from "../models/Homework.js";
import Class from "../models/Class.js";
import Student from "../models/Student.js";
import HomeworkSubmission from "../models/HomeworkSubmission.js";

const getTeacherId = (req) => String(req.user?.id || req.user?._id || "");

export const createHomework = async (req, res) => {
  try {
    const teacherId = getTeacherId(req);

    const { title, description, type, noteText, dueDate } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title required" });
    }

    const assignedClass = await Class.findOne({ classTeacher: teacherId });
    if (!assignedClass) {
      return res.status(404).json({ message: "No class assigned to you" });
    }

    let payload = {
      classId: assignedClass._id,
      teacherId,
      title: title.trim(),
      description: (description || "").trim(),
      type: ["pdf", "image"].includes(type) ? type : "note",
      dueDate: dueDate ? String(dueDate) : undefined,
    };

    if (payload.type === "note") {
      if (!noteText?.trim()) {
        return res.status(400).json({ message: "Note text required" });
      }
      payload.noteText = noteText.trim();
    }

    if (payload.type === "pdf" || payload.type === "image") {
      if (!req.file) {
        return res.status(400).json({
          message:
            payload.type === "pdf"
              ? "PDF file required"
              : "Image file required",
        });
      }

      payload.fileUrl = `/uploads/homework/${req.file.filename}`;
      payload.fileName = req.file.originalname;
    }

    const hw = await Homework.create(payload);

    return res.status(201).json({
      message: "Homework created",
      homework: hw,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const getTeacherHomework = async (req, res) => {
  try {
    const teacherId = getTeacherId(req);

    const assignedClass = await Class.findOne({ classTeacher: teacherId });
    if (!assignedClass) return res.json({ class: null, list: [] });

    const list = await Homework.find({ classId: assignedClass._id })
      .sort({ createdAt: -1 });

    return res.json({ class: assignedClass, list });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// for students/parents view (based on their class — later we can use req.user role)
export const getHomeworkByClass = async (req, res) => {
  try {
    const { classId } = req.query;
    if (!classId) return res.status(400).json({ message: "classId required" });

    const list = await Homework.find({ classId }).sort({ createdAt: -1 });
    return res.json(list);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const deleteHomework = async (req, res) => {
  try {
    const teacherId = req.user?.id || req.user?._id;
    const { id } = req.params;

    const hw = await Homework.findById(id);
    if (!hw) return res.status(404).json({ message: "Homework not found" });

    if (String(hw.teacherId) !== String(teacherId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await hw.deleteOne();
    res.json({ message: "Homework deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const getMyHomework = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const role = req.user?.role;

    if (role === "student") {
      const student = await Student.findOne({ userId }).select("classId");
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      const list = await Homework.find({ classId: student.classId })
        .sort({ createdAt: -1 });

      return res.json({ classId: student.classId, list });
    }

    if (role === "parent") {
      const student = await Student.findOne({ parentId: userId }).select("classId");
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      const list = await Homework.find({ classId: student.classId })
        .sort({ createdAt: -1 });

      return res.json({ classId: student.classId, list });
    }

    return res.status(403).json({ message: "Not allowed" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};


export const submitHomework = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { homeworkId } = req.body;

    if (!homeworkId) {
      return res.status(400).json({ message: "homeworkId required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const existing = await HomeworkSubmission.findOne({ homeworkId, studentId });
    if (existing) {
      return res.status(400).json({ message: "Already submitted" });
    }

    const submission = await HomeworkSubmission.create({
      homeworkId,
      studentId,
      fileUrl: `/uploads/submissions/${req.file.filename}`, // ✅ FIX
      fileName: req.file.originalname,
      submittedAt: new Date(),
    });

    return res.status(201).json({ message: "Submitted successfully", submission });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};


export const getHomeworkSubmissions = async (req, res) => {
  try {
    const teacherId = getTeacherId(req);
    const { homeworkId } = req.params;

    const hw = await Homework.findById(homeworkId).select("classId teacherId");
    if (!hw) return res.status(404).json({ message: "Homework not found" });

    // ✅ only creator teacher can view
    if (String(hw.teacherId) !== String(teacherId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const list = await HomeworkSubmission.find({ homeworkId })
      .populate("studentId", "name email")
      .sort({ submittedAt: -1 });

    return res.json({ list });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};