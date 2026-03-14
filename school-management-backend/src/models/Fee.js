import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    paymentDate: { type: String, default: "" },
    receiptNo: { type: String, default: "", trim: true },
    method: { type: String, default: "cash", trim: true },
    remarks: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    feeTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeType",
      required: true,
    },

    month: {
      type: String,
      required: true,
      trim: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueDate: {
      type: String,
      default: "",
    },

    paymentDate: {
      type: String,
      default: "",
    },

    receiptNo: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["paid", "partial", "unpaid"],
      default: "unpaid",
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },

    payments: {
      type: [paymentSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

feeSchema.index(
  { studentId: 1, feeTypeId: 1, month: 1 },
  { unique: true }
);

export default mongoose.model("Fee", feeSchema);