import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileUrl: String,
    fileName: String,

    marks: Number,
    feedback: String,

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HomeworkSubmission", submissionSchema);