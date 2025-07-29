const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const authMiddleware = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
  "/profile",
  authMiddleware.authenticateToken,
  authController.getProfile
);

module.exports = router;
