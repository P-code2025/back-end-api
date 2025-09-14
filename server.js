const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Đọc file db.json
function readDB() {
  const dataPath = path.join(__dirname, "api", "db.json");
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

// Trả data khi vào root "/"
app.get("/", (req, res) => {
  const json = readDB();
  res.json(json); // Trả toàn bộ nội dung db.json
});

// Nếu muốn chỉ trả tasks thì:
app.get("/api/tasks", (req, res) => {
  const json = readDB();
  res.json(json.tasks || []);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
