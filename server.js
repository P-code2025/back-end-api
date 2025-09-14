const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("API is running");
});

// Lấy toàn bộ tasks từ db.json
app.get("/api/tasks", (req, res) => {
  const dataPath = path.join(__dirname, "api", "db.json");
  const raw = fs.readFileSync(dataPath);
  const json = JSON.parse(raw);
  res.json(json.tasks || []);
});

// Thêm task mới
app.post("/api/tasks", (req, res) => {
  const dataPath = path.join(__dirname, "api", "db.json");
  const raw = fs.readFileSync(dataPath);
  const json = JSON.parse(raw);

  const newTask = req.body;
  newTask.id = Date.now().toString();
  json.tasks.push(newTask);

  fs.writeFileSync(dataPath, JSON.stringify(json, null, 2));
  res.status(201).json(newTask);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
