let multer = require('multer');
const path = require("path");
const fs = require("fs");

const uploadsDirectory = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDirectory, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDirectory),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF allowed"), false);
};

exports.upload = multer({ storage, fileFilter });