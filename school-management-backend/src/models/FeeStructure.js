import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
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

    amount: {
      type: Number,
      required: true,
    },

    frequency: {
      type: String,
      enum: ["monthly", "quarterly", "yearly", "one-time"],
      default: "monthly",
    },

    isOptional: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

feeStructureSchema.index({ classId: 1, feeTypeId: 1 }, { unique: true });

export default mongoose.model("FeeStructure", feeStructureSchema);