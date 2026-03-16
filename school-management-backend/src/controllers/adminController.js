import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: false })
      .select("name email role approved createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        if (user.role === "teacher") {
          const teacherProfile = await Teacher.findOne({
            userId: user._id,
          }).lean();

          return {
            ...user,
            teacherProfile: teacherProfile
              ? {
                  qualification: teacherProfile.qualification || "",
                  experienceYears: teacherProfile.experienceYears || 0,
                  subjectSpeciality: teacherProfile.subjectSpeciality || "",
                  contactNumber: teacherProfile.contactNumber || "",
                  address: teacherProfile.address || "",
                  profileBio: teacherProfile.profileBio || "",
                }
              : null,
          };
        }

        if (user.role === "student") {
          const studentProfile = await Student.findOne({
            userId: user._id,
          })
            .populate("classId", "className section")
            .populate("parentId", "name email")
            .lean();

          return {
            ...user,
            studentProfile: studentProfile
              ? {
                  fatherName: studentProfile.fatherName || "",
                  motherName: studentProfile.motherName || "",
                  contactNumber: studentProfile.contactNumber || "",
                  address: studentProfile.address || "",
                  className: studentProfile.classId?.className || "",
                  section: studentProfile.classId?.section || "",
                  parentName: studentProfile.parentId?.name || "",
                  parentEmail: studentProfile.parentId?.email || "",
                }
              : null,
          };
        }

        return user;
      })
    );

    return res.json({ users: enrichedUsers });
  } catch (error) {
    console.error("getPendingUsers error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User approved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/teachers?page=1&limit=10&search=&approved=
export const getTeachers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "10", 10), 1),
      50
    );
    const skip = (page - 1) * limit;

    const { search = "", approved } = req.query;

    const filter = { role: "teacher" };

    if (approved === "true") filter.approved = true;
    if (approved === "false") filter.approved = false;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [teachers, total] = await Promise.all([
      User.find(filter)
        .select("name email role approved createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({ page, limit, total, teachers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminAttendanceSummary = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const classes = await Class.find()
      .populate("classTeacher", "name email")
      .sort({ className: 1, section: 1 });

    const classRows = await Promise.all(
      classes.map(async (cls) => {
        const totalStudents = await Student.countDocuments({ classId: cls._id });

        const attendance = await Attendance.findOne({
          classId: cls._id,
          date,
        });

        const present =
          attendance?.records.filter((r) => r.status === "present").length || 0;

        const absent =
          attendance?.records.filter((r) => r.status === "absent").length || 0;

        return {
          classId: cls._id,
          className: cls.className,
          section: cls.section,
          classTeacher: cls.classTeacher
            ? {
                _id: cls.classTeacher._id,
                name: cls.classTeacher.name,
                email: cls.classTeacher.email,
              }
            : null,
          totalStudents,
          present,
          absent,
          percentage:
            totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0,
          marked: !!attendance,
        };
      })
    );

    const totalStudents = classRows.reduce(
      (sum, row) => sum + row.totalStudents,
      0
    );
    const totalPresent = classRows.reduce((sum, row) => sum + row.present, 0);
    const totalAbsent = classRows.reduce((sum, row) => sum + row.absent, 0);
    const attendancePercentage =
      totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

    return res.json({
      date,
      summary: {
        totalStudents,
        totalPresent,
        totalAbsent,
        attendancePercentage,
      },
      classes: classRows,
    });
  } catch (error) {
    console.error("getAdminAttendanceSummary error:", error);
    return res.status(500).json({
      message: "Failed to load attendance summary",
      error: error.message,
    });
  }
};

export const getAdminAttendanceClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const cls = await Class.findById(classId).populate(
      "classTeacher",
      "name email"
    );

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const students = await Student.find({ classId: cls._id })
      .populate("userId", "name email approved")
      .sort({ createdAt: -1 });

    const attendance = await Attendance.findOne({
      classId: cls._id,
      date,
    }).populate("markedBy", "name email");

    const records = students.map((student) => {
      const matched = attendance?.records.find(
        (r) => String(r.studentId) === String(student._id)
      );

      return {
        studentId: student._id,
        userId: student.userId?._id,
        name: student.userId?.name || "-",
        email: student.userId?.email || "-",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        contactNumber: student.contactNumber || "",
        status: matched?.status || "not-marked",
      };
    });

    const totalStudents = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const notMarked = records.filter((r) => r.status === "not-marked").length;

    return res.json({
      date,
      class: {
        _id: cls._id,
        className: cls.className,
        section: cls.section,
        classTeacher: cls.classTeacher || null,
      },
      attendanceMeta: attendance
        ? {
            _id: attendance._id,
            markedBy: attendance.markedBy || null,
            markedAt: attendance.updatedAt,
          }
        : null,
      summary: {
        totalStudents,
        present,
        absent,
        notMarked,
        percentage:
          totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0,
      },
      records,
    });
  } catch (error) {
    console.error("getAdminAttendanceClassDetails error:", error);
    return res.status(500).json({
      message: "Failed to load class attendance",
      error: error.message,
    });
  }
};