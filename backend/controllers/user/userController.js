const pool = require("../../config/db");
const jwt = require("../../utils/jwt");

const updateMyProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({ message: "No update data provided" });
    }

    await pool.execute(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, req.user.id]
    );

    const [updatedRows] = await pool.execute(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    const updatedUser = updatedRows[0];

    const payload = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    };
    const newAccessToken = jwt.generateAccessToken(payload);

    return res.json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  updateMyProfile,
};
