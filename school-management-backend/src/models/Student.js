import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
    },

    motherName: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);