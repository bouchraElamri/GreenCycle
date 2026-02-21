const multer = require("multer");
const path = require("path");
const fs = require("fs");

const profileUploadDir = path.join(process.cwd(), "uploads", "profiles");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(profileUploadDir, { recursive: true });
    cb(null, profileUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadProfile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = uploadProfile;
