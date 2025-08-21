const app = require("./app");
const pool = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

pool
  .getConnection()
  .then((conn) => {
    console.log("✅ Database connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.execute(
      "SELECT id, username, email FROM users WHERE id = ?",
      [decoded.id]
    );
    if (rows.length === 0) return next(new Error("User not found"));

    socket.user = rows[0];
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("🟢 connected", socket.id, "user:", socket.user.username);

  socket.on("send_message", (data) => {
    const payload = {
      ...data,
      username: socket.user.username || "Anonymous",
    };
    console.log("📩 send_message:", payload);
    io.emit("receive_message", payload);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 disconnected:", socket.id, reason);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
