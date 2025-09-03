import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

// Enable CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Connect to the DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "reno",
});

db.connect((err) => {
  if (err) console.error("❌ MySQL connection failed:", err);
  else console.log("✅ MySQL connected to reno DB");
});

/* =======================
   SCHOOLS TABLE ROUTES
======================= */

// GET all schools
app.get("/schools", (req, res) => {
  db.query("SELECT * FROM schools", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET one school by id
app.get("/schools/:id", (req, res) => {
  db.query(
    "SELECT * FROM schools WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    }
  );
});

/* =======================
   STUDENTS TABLE ROUTES
======================= */

// GET all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new student (application)
app.post("/students", (req, res) => {
  const { name, contact, email, classNumber } = req.body;

  if (!name || !contact || !email || !classNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO students (name, class_number, contact, email) VALUES (?,?,?,?)",
    [name, classNumber, contact, email],
    (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Student added successfully",
        id: results.insertId,
      });
    }
  );
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
