const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("../../utils/jwt");

const authController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const user = await User.findById(userId);

      const token = jwt.generateToken({ id: user.id });

      res.status(201).json({ user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.generateToken({ id: user.id });

      delete user.password;

      res.json({ user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
