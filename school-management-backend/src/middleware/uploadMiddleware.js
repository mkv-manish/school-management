import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images allowed (jpg, png, webp)"), false);
};

export const uploadNoticeImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
}).single("image");

