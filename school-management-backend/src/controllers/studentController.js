import Student from "../models/Student.js";

// Assign student to class
export const assignStudentToClass = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { classId },
      { new: true }
    );

    res.json({
      message: "Student assigned to class successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get students by class
export const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.find({ classId })
      .populate("userId", "name email")
      .populate("classId", "className section");

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/students
 * Admin: list all students with pagination + search + class filter
 * Query:
 *  - page=1
 *  - limit=10
 *  - search=rahul (matches name/email)
 *  - classId=<mongoId>
 */
export const getAllStudents = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const { search = "", classId, approved } = req.query;

    // build filter for Student collection
    const studentFilter = {};
    if (classId) studentFilter.classId = classId;
    
    // populate filter for User (name/email search)
    const userMatch = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};
      if (approved === "true") userMatch.approved = true;
if (approved === "false") userMatch.approved = false;

    const [rows, total] = await Promise.all([
      Student.find(studentFilter)
        .populate({
          path: "userId",
          select: "name email role approved",
          match: userMatch,
        })
        .populate("classId", "className section")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Student.countDocuments(studentFilter),
    ]);

    // because populate match can return userId = null (when search doesn't match)
    const students = rows.filter((s) => s.userId);

    return res.json({
      page,
      limit,
      total,
      count: students.length,
      students,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};