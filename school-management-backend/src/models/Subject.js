import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);