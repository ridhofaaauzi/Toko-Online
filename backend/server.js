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

const app = require("./app");
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on ort ${port}`);
});
