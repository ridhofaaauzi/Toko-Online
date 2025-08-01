// backend/middleware/auth.js
const { verifyToken } = require("../utils/jwt");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    let message = "Invalid token";
    if (error.name === "TokenExpiredError") message = "Token expired";
    res.status(401).json({ success: false, message });
  }
};

module.exports = { authenticateToken };
