const multer = require("multer");
const path = require("path");
const fs = require("fs");

const productUploadDir = path.join(process.cwd(), "uploads", "products");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(productUploadDir, { recursive: true });
    cb(null, productUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
