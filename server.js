const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const tasksRouter = require("./api/tasks.router");

const app = express();
app.use(cors());
app.use(express.json());

// Đọc file db.json
function readDB() {
  const dataPath = path.join(__dirname, "api", "db.json");
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

// Route root trả toàn bộ db.json
app.get("/", (req, res) => {
  const json = readDB();
  res.json(json);
});

// Mount router CRUD tasks
app.use("/api/tasks", tasksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
