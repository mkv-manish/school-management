import FeeType from "../models/FeeType.js";

export const createFeeType = async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: "name and code are required",
      });
    }

    const existing = await FeeType.findOne({
      $or: [
        { name: String(name).trim() },
        { code: String(code).trim() },
      ],
    });

    if (existing) {
      return res.status(400).json({
        message: "Fee type with same name or code already exists",
      });
    }

    const feeType = await FeeType.create({
      name: String(name).trim(),
      code: String(code).trim(),
      description: description ? String(description).trim() : "",
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      message: "Fee type created successfully",
      feeType,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFeeTypes = async (req, res) => {
  try {
    const feeTypes = await FeeType.find().sort({ createdAt: -1 });
    return res.json(feeTypes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateFeeType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, isActive } = req.body;

    const feeType = await FeeType.findById(id);
    if (!feeType) {
      return res.status(404).json({ message: "Fee type not found" });
    }

    if (name != null) feeType.name = String(name).trim();
    if (code != null) feeType.code = String(code).trim();
    if (description != null) feeType.description = String(description).trim();
    if (typeof isActive === "boolean") feeType.isActive = isActive;

    await feeType.save();

    return res.json({
      message: "Fee type updated successfully",
      feeType,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteFeeType = async (req, res) => {
  try {
    const { id } = req.params;

    const feeType = await FeeType.findById(id);
    if (!feeType) {
      return res.status(404).json({ message: "Fee type not found" });
    }

    await feeType.deleteOne();

    return res.json({
      message: "Fee type deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};