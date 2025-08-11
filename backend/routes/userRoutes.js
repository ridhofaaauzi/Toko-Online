const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const userController = require("../controllers/user/userController");
const { authenticateToken } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);

router
  .route("/profile")
  .get(authenticateToken, authController.getProfile)
  .put(authenticateToken, userController.updateMyProfile);

module.exports = router;
