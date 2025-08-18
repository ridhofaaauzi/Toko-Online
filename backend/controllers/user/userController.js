const pool = require("../../config/db");

const updateMyProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and email are required",
      });
    }

    const [result] = await pool.execute(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [users] = await pool.execute(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: users[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  updateMyProfile,
};
