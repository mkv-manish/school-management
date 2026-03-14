// models/School.js

import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    schoolName: String,
    logoUrl: String,
    address: String,
    contactNumber: String,
    email: String,
    principalName: String,
    academicYear: String,
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);