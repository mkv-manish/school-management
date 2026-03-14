import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    qualification: String,
    experienceYears: Number,
    subjectSpeciality: String,
    contactNumber: String,
    address: String,
    profileBio: String,
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);