import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Homework from "../models/Homework.js";

export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const assignedClass = await Class.findOne({
      classTeacher: teacherId,
    }).populate("classTeacher", "name email");

    if (!assignedClass) {
      return res.json({
        message: "No class assigned yet",
        class: null,
        totalStudents: 0,
        totalHomework: 0,
      });
    }

    const [totalStudents, totalHomework] = await Promise.all([
      Student.countDocuments({
        classId: assignedClass._id,
      }),
      Homework.countDocuments({
        classId: assignedClass._id,
        teacherId,
      }),
    ]);

    return res.json({
      class: assignedClass,
      totalStudents,
      totalHomework,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};