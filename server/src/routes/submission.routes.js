const express = require("express");
const multer = require("multer");

const {
  createSubmission,
  getSubmission,
} = require("../controllers/submission.controller");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});


router.post("/", (req, res, next) => {
  upload.single("submission")(req, res, (error) => {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size must be 50 MB or less",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || "Invalid submission file",
      });
    }

    next();
  });
}, createSubmission);

router.get("/", getSubmission);

module.exports = router;