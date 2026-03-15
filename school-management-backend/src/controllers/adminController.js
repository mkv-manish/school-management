import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

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