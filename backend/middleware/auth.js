const jwt = require("../utils/jwt");

const authMiddleware = {
  authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unathorized" });
    }

    try {
      const decoded = jwt.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  },
};

module.exports = authMiddleware;
