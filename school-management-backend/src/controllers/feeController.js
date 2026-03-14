import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import FeeStructure from "../models/FeeStructure.js";

export const createFee = async (req, res) => {
  try {
    const {
  studentId,
  classId,
  month,
  totalAmount,
  paidAmount,
  dueDate,
  paymentDate,
  receiptNo,
  remarks,
} = req.body;

    if (!studentId || !classId || !month || totalAmount == null) {
      return res.status(400).json({
        message: "studentId, classId, month, totalAmount required",
      });
    }

    const total = Number(totalAmount);
    const paid = Number(paidAmount || 0);

    const fee = await Fee.create({
  studentId,
  classId,
  month: String(month).trim(),
  totalAmount: total,
  paidAmount: paid,
  dueDate: dueDate ? String(dueDate) : "",
  paymentDate: paymentDate ? String(paymentDate) : "",
  receiptNo: receiptNo ? String(receiptNo).trim() : "",
  remarks: remarks ? String(remarks).trim() : "",
  status: getFeeStatus(total, paid),
  createdBy: req.user?._id,
});
    return res.status(201).json({
      message: "Fee created successfully",
      fee,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("classId", "className section")
      .sort({ createdAt: -1 });

    return res.json(fees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyFees = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const role = req.user?.role;

    let student = null;

    if (role === "student") {
      student = await Student.findOne({ userId });
    }

    if (role === "parent") {
      student = await Student.findOne({ parentId: userId });
    }

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const fees = await Fee.find({ studentId: student._id })
      .populate("classId", "className section")
      .sort({ createdAt: -1 });

    return res.json(fees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
  month,
  totalAmount,
  paidAmount,
  dueDate,
  paymentDate,
  receiptNo,
  remarks,
} = req.body;

    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    const total =
      totalAmount != null ? Number(totalAmount) : Number(fee.totalAmount);
    const paid =
      paidAmount != null ? Number(paidAmount) : Number(fee.paidAmount);

    fee.month = month != null ? String(month).trim() : fee.month;
    fee.totalAmount = total;
    fee.paidAmount = paid;
    fee.dueDate = dueDate != null ? String(dueDate) : fee.dueDate;
    fee.remarks = remarks != null ? String(remarks).trim() : fee.remarks;
    fee.status = getFeeStatus(total, paid);
    fee.paymentDate = paymentDate != null ? String(paymentDate) : fee.paymentDate;
    fee.receiptNo = receiptNo != null ? String(receiptNo).trim() : fee.receiptNo;

    await fee.save();

    return res.json({
      message: "Fee updated successfully",
      fee,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    await fee.deleteOne();

    return res.json({
      message: "Fee deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addFeePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentDate, receiptNo, method, remarks } = req.body;

    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    const payAmount = Number(amount || 0);
    if (payAmount <= 0) {
      return res.status(400).json({ message: "Valid payment amount required" });
    }

    fee.payments.push({
      amount: payAmount,
      paymentDate: paymentDate ? String(paymentDate) : "",
      receiptNo: receiptNo ? String(receiptNo).trim() : "",
      method: method ? String(method).trim() : "cash",
      remarks: remarks ? String(remarks).trim() : "",
    });

    fee.paidAmount = Number(fee.paidAmount || 0) + payAmount;

    if (!fee.paymentDate && paymentDate) {
      fee.paymentDate = String(paymentDate);
    }

    if (!fee.receiptNo && receiptNo) {
      fee.receiptNo = String(receiptNo).trim();
    }

    fee.status = getFeeStatus(fee.totalAmount, fee.paidAmount);

    await fee.save();

    return res.json({
      message: "Payment added successfully",
      fee,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createFeesForClass = async (req, res) => {
  try {
    const {
      classId,
      month,
      totalAmount,
      paidAmount,
      dueDate,
      paymentDate,
      receiptNo,
      remarks,
    } = req.body;

    if (!classId || !month || totalAmount == null) {
      return res.status(400).json({
        message: "classId, month, totalAmount required",
      });
    }

    const classRow = await Class.findById(classId);
    if (!classRow) {
      return res.status(404).json({ message: "Class not found" });
    }

    const students = await Student.find({ classId });
    if (!students.length) {
      return res.status(404).json({ message: "No students found in this class" });
    }

    const total = Number(totalAmount);
    const paid = Number(paidAmount || 0);

    const created = [];
    const skipped = [];

    for (const student of students) {
      const existing = await Fee.findOne({
        studentId: student._id,
        classId,
        month: String(month).trim(),
      });

      if (existing) {
        skipped.push(student._id);
        continue;
      }

      const fee = await Fee.create({
        studentId: student._id,
        classId,
        month: String(month).trim(),
        totalAmount: total,
        paidAmount: paid,
        dueDate: dueDate ? String(dueDate) : "",
        paymentDate: paymentDate ? String(paymentDate) : "",
        receiptNo: receiptNo ? String(receiptNo).trim() : "",
        remarks: remarks ? String(remarks).trim() : "",
        status: getFeeStatus(total, paid),
        createdBy: req.user?._id,
      });

      created.push(fee._id);
    }

    return res.status(201).json({
      message: "Class fee generation completed",
      createdCount: created.length,
      skippedCount: skipped.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getFeeStatus = (totalAmount, paidAmount) => {
  const total = Number(totalAmount || 0);
  const paid = Number(paidAmount || 0);

  if (paid <= 0) return "unpaid";
  if (paid >= total) return "paid";
  return "partial";
};

export const generateFeesFromStructure = async (req, res) => {
  try {
    const { classId, month, dueDate, remarks } = req.body;

    if (!classId || !month) {
      return res.status(400).json({
        message: "classId and month are required",
      });
    }

    const classRow = await Class.findById(classId);
    if (!classRow) {
      return res.status(404).json({ message: "Class not found" });
    }

    const students = await Student.find({ classId });
    if (!students.length) {
      return res.status(404).json({ message: "No students found in this class" });
    }

    const structures = await FeeStructure.find({ classId })
      .populate("feeTypeId", "name code isActive");

    if (!structures.length) {
      return res.status(404).json({
        message: "No fee structures found for this class",
      });
    }

    const created = [];
    const skipped = [];

    for (const student of students) {
      for (const structure of structures) {
        if (!structure.feeTypeId) continue;
        if (structure.feeTypeId.isActive === false) continue;

        const existing = await Fee.findOne({
          studentId: student._id,
          feeTypeId: structure.feeTypeId._id,
          month: String(month).trim(),
        });

        if (existing) {
          skipped.push({
            studentId: student._id,
            feeTypeId: structure.feeTypeId._id,
          });
          continue;
        }

        const fee = await Fee.create({
          studentId: student._id,
          classId,
          feeTypeId: structure.feeTypeId._id,
          month: String(month).trim(),
          totalAmount: Number(structure.amount || 0),
          paidAmount: 0,
          dueDate: dueDate ? String(dueDate) : "",
          remarks: remarks
            ? String(remarks).trim()
            : structure.notes || "",
          status: getFeeStatus(structure.amount, 0),
          createdBy: req.user?._id,
        });

        created.push(fee._id);
      }
    }

    return res.status(201).json({
      message: "Fees generated from structure successfully",
      createdCount: created.length,
      skippedCount: skipped.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};