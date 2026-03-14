import FeeStructure from "../models/FeeStructure.js";

export const createFeeStructure = async (req, res) => {
  try {
    const { classId, feeTypeId, amount, frequency, isOptional, notes } =
      req.body;

    if (!classId || !feeTypeId || amount == null) {
      return res.status(400).json({
        message: "classId, feeTypeId and amount are required",
      });
    }

    const existing = await FeeStructure.findOne({ classId, feeTypeId });
    if (existing) {
      return res.status(400).json({
        message: "Fee structure already exists for this class and fee type",
      });
    }

    const structure = await FeeStructure.create({
      classId,
      feeTypeId,
      amount: Number(amount),
      frequency: frequency || "monthly",
      isOptional: typeof isOptional === "boolean" ? isOptional : false,
      notes: notes ? String(notes).trim() : "",
    });

    return res.status(201).json({
      message: "Fee structure created successfully",
      structure,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFeeStructures = async (req, res) => {
  try {
    const rows = await FeeStructure.find()
      .populate("classId", "className section")
      .populate("feeTypeId", "name code")
      .sort({ createdAt: -1 });

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, frequency, isOptional, notes } = req.body;

    const structure = await FeeStructure.findById(id);
    if (!structure) {
      return res.status(404).json({ message: "Fee structure not found" });
    }

    if (amount != null) structure.amount = Number(amount);
    if (frequency != null) structure.frequency = frequency;
    if (typeof isOptional === "boolean") structure.isOptional = isOptional;
    if (notes != null) structure.notes = String(notes).trim();

    await structure.save();

    return res.json({
      message: "Fee structure updated successfully",
      structure,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;

    const structure = await FeeStructure.findById(id);
    if (!structure) {
      return res.status(404).json({ message: "Fee structure not found" });
    }

    await structure.deleteOne();

    return res.json({
      message: "Fee structure deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};