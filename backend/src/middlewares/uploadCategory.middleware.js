const multer = require("multer");
const path = require("path");
const fs = require("fs");

const categoryUploadDir = path.join(process.cwd(), "uploads", "categories");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(categoryUploadDir, { recursive: true });
    cb(null, categoryUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadCategory = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }

    const err = new Error("Category image must be an image file");
    err.statusCode = 400;
    return cb(err);
  },
});

module.exports = uploadCategory;
