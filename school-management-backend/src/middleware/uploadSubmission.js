import multer from "multer";
import path from "path";
import fs from "fs";

const submissionsDir = "uploads/submissions";
if (!fs.existsSync(submissionsDir)) {
  fs.mkdirSync(submissionsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, submissionsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `sub-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF and image files are allowed"), false);
  }

  cb(null, true);
};

export const uploadSubmission = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});