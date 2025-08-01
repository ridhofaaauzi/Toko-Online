const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("../../utils/jwt");
const validator = require("validator");

const authController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
          missing: {
            username: !username,
            email: !email,
            password: !password,
          },
        });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
          errors: { email: "Please enter a valid email" },
        });
      }

      const [existingEmail] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      const [existingUsername] = await pool.execute(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );

      if (existingEmail.length > 0 || existingUsername.length > 0) {
        const errors = {};
        if (existingEmail.length > 0) errors.email = "Email already in use";
        if (existingUsername.length > 0)
          errors.username = "Username already taken";

        return res.status(409).json({
          success: false,
          message: "User already exists",
          errors,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await pool.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );

      const token = jwt.generateToken({ id: result.insertId });

      const [user] = await pool.execute(
        "SELECT id, username, email, created_at FROM users WHERE id = ?",
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        user: user[0],
        token,
      });
    } catch (error) {
      console.error("Registration Error:", error);
      return res.status(500).json({
        success: false,
        message: "Registration failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
          errors: {
            email: !email ? "Email is required" : null,
            password: !password ? "Password is required" : null,
          },
        });
      }

      const [users] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      const user = users[0];

      if (!user) {
        return res.status(401).json({
          message: "Email or Password is Wrong",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          errors: { password: "Incorrect password" },
        });
      }

      const token = jwt.generateToken({ id: user.id });

      delete user.password;

      return res.json({
        message: "Login successful",
        user,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getProfile(req, res) {
    try {
      const [users] = await pool.execute(
        "SELECT id, username, email, created_at FROM users WHERE id = ?",
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user: users[0],
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load profile",
      });
    }
  },
};

module.exports = authController;
