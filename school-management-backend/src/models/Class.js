import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Prevent duplicate class + section
classSchema.index({ className: 1, section: 1 }, { unique: true });

export default mongoose.model("Class", classSchema);