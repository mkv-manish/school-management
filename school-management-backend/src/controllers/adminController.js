import User from "../models/User.js";

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: false })
      .select("name email role approved createdAt")
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
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