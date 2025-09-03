// server.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse JSON request bodies

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "reno",
});

db.connect((err) => {
  if (err) return console.error("❌ DB connection failed:", err);
  console.log("✅ Connected to MySQL");
});

// ✅ Routes

// Get all schools
app.get("/schools", (req, res) => {
  const sql = "SELECT * FROM schools";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const data = results.map((school) => ({
      id: school.id,
      name: school.name,
      address: school.address,
      city: school.city,
      state: school.state,
      contact: school.contact,
      email_id: school.email_id,
      image: school.image,
    }));

    res.json(data);
  });
});

// Get single school by ID
app.get("/schools/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM schools WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ error: "School not found" });

    const school = {
      id: results[0].id,
      name: results[0].name,
      address: results[0].address,
      city: results[0].city,
      state: results[0].state,
      contact: results[0].contact,
      email_id: results[0].email_id,
      image: results[0].image,
    };

    res.json(school);
  });
});

// ✅ Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
