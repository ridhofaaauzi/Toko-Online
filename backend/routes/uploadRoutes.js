const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("../controllers/product/uploadController");
const { authenticateToken } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  uploadController.uploadImage
);
router.delete("/:filename", authenticateToken, uploadController.deleteImage);

module.exports = router;
