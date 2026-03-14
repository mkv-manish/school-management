import Class from "../models/Class.js";
import User from "../models/User.js";

// Create Class
export const createClass = async (req, res) => {
  try {
    const { className, section, classTeacher } = req.body;

    const newClass = await Class.create({
      className,
      section,
      classTeacher,
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate("classTeacher", "name email");

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClasses = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const filter = search
      ? {
          $or: [
            { className: { $regex: search, $options: "i" } },
            { section: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const classes = await Class.find(filter)
      .populate("classTeacher", "name email approved")
      .sort({ createdAt: -1 });

    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, section } = req.body;

    const updated = await Class.findByIdAndUpdate(
      id,
      {
        className: className.trim(),
        section: (section || "").trim(),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Class not found" });

    res.json({ message: "Class updated", class: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Class.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Class not found" });

    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignClassTeacher = async (req, res) => {
  try {
    const { id } = req.params; // classId
    const { teacherId } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ message: "Invalid teacher" });
    }

    const updated = await Class.findByIdAndUpdate(
      id,
      { classTeacher: teacherId },
      { new: true }
    ).populate("classTeacher", "name email approved");

    if (!updated) return res.status(404).json({ message: "Class not found" });

    res.json({ message: "Teacher assigned", class: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};