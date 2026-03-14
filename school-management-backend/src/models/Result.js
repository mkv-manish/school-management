import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
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

    subject: {
      type: String,
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    examType: {
      type: String,
      enum: ["midterm", "final", "unit-test"],
      required: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher
    },
  },
  { timestamps: true }
);

// Prevent duplicate entry
resultSchema.index(
  { studentId: 1, subject: 1, examType: 1 },
  { unique: true }
);

export default mongoose.model("Result", resultSchema);