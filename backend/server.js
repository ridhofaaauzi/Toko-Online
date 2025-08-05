const app = require("./app");
const pool = require("./config/db");

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

const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
