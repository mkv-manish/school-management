import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    audience: {
      type: String,
      enum: ["all", "student", "teacher", "parent"],
      default: "all",
    },
    imageUrl: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);