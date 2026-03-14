import Notice from "../models/Notice.js";

export const createNotice = async (req, res) => {
  try {
    const { title, description, audience } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title & description required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const notice = await Notice.create({
      title,
      description,
      audience,
      imageUrl,
      createdBy: req.user?._id,
    });

    return res.status(201).json({
      message: "Notice created",
      notice,
    });
  } catch (error) {
    console.error("CREATE NOTICE ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getNotices = async (req, res) => {
  try {
    const role = req.user.role;

    let filter = {};
    if (role !== "admin") {
      filter = { $or: [{ audience: "all" }, { audience: role }] };
    }

    const notices = await Notice.find(filter)
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    return res.json(notices);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    await notice.deleteOne();

    return res.json({
      message: "Notice deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};