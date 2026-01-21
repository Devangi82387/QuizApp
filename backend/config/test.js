import pool from "./db.js";

try {
  await pool.query("SELECT 1");
  console.log("MySQL connected from Node");
} catch (err) {
  console.error("MySQL connection failed:", err.message);
}
