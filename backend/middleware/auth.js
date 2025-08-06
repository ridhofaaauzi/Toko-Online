const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    (authHeader && authHeader.split(" ")[1]) ||
    req.query.token ||
    req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Akses ditolak. Token diperlukan.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Token tidak valid atau kadaluarsa.",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
