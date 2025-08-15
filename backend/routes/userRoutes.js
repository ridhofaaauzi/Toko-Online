const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const userController = require("../controllers/user/userController");
const { authenticateToken } = require("../middleware/auth");
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} = require("../middleware/rateLimiter");

router.post("/register", registerLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/google", authController.googleLogin);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  authController.forgotPassword
);
router.post(
  "/reset-password/:token",
  resetPasswordLimiter,
  authController.resetPassword
);

router
  .route("/profile")
  .get(authenticateToken, authController.getProfile)
  .put(authenticateToken, userController.updateMyProfile);

module.exports = router;
