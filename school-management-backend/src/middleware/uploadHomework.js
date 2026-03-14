import multer from "multer";
import path from "path";
import fs from "fs";

const dir = "uploads/homework";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `hw_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PDF and image files are allowed"), false);
  }

  cb(null, true);
};

export const homeworkUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});