import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["note", "pdf", "image"],
      default: "note",
    },

    // for type=note
    noteText: {
      type: String,
    },

    // for type=pdf or image
    fileUrl: {
      type: String,
    },

    fileName: {
      type: String,
    },

    dueDate: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Homework", homeworkSchema);