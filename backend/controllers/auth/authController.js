const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("../../utils/jwt");
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async googleLogin(req, res) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Google token is required" });
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const email = payload.email;
      const name = payload.name;

      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      let user;

      if (rows.length > 0) {
        user = rows[0];
      } else {
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const [result] = await pool.execute(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword]
        );

        const [newUserRows] = await pool.execute(
          "SELECT * FROM users WHERE id = ?",
          [result.insertId]
        );
        user = newUserRows[0];
      }

      const jwtToken = jwt.generateToken({ id: user.id, email: user.email });

      res.json({
        message: "Login berhasil",
        token: jwtToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Google login error:", error);
      res
        .status(500)
        .json({ message: "Google login failed", error: error.message });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
          message: "Email Not Active",
        });
      }

      const [users] = await pool.execute(
        "SELECT * FROM users WHERE email = ? ",
        [email]
      );

      if (users.length === 0) {
        return res.status(404).json({
          message: "Email Not Registered",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpiry = new Date(Date.now() + 3600000);

      await pool.execute(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, resetExpiry, email]
      );

      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

      await transporter.sendMail({
        from: `"Support Toko Online" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Password",
        html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px;">
      <h2 style="color:#333;">Reset Password</h2>
      <p>Halo, silakan klik tombol di bawah ini untuk mereset password kamu:</p>
      <a href="${resetUrl}" style="display:inline-block; padding:10px 20px; margin-top:20px; background:#4CAF50; color:#fff; text-decoration:none; border-radius:5px;">Reset Password</a>
      <p style="font-size:12px; color:#888; margin-top:20px;">Jika kamu tidak meminta reset password, abaikan email ini.</p>
    </div>
  `,
      });

      return res.json({
        message: "Email Reset Password telah dikirim",
      });
    } catch (error) {
      console.error("Email error:", error);
      return res
        .status(500)
        .json({ message: "Gagal mengirim email reset password" });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password || password.length < 6) {
        return res.status(400).json({
          message: "Password Minimal 6 Karakter",
        });
      }

      const [users] = await pool.execute(
        "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
        [token]
      );

      if (users.length === 0) {
        return res.status(400).json({
          message: "Token Tidak Valid atau sudah kadaluarsa",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.execute(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
        [hashedPassword, users[0].id]
      );

      return res.status(200).json({
        message: "Password Berhasil Direset",
      });
    } catch (error) {
      return res.status(500).json({ message: "Gagal mereset password" });
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
      return res.status(500).json({
        success: false,
        message: "Failed to load profile",
      });
    }
  },
};

module.exports = authController;
