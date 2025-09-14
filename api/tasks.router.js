const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const router = Router();
const dataPath = path.join(__dirname, "db.json");

function readDB() {
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
  const db = readDB();
  res.status(200).json(db.tasks || []);
});

router.get("/:id", (req, res) => {
  const db = readDB();
  const task = (db.tasks || []).find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.status(200).json(task);
});

router.post("/", (req, res) => {
  const newTask = req.body;
  if (!newTask || typeof newTask !== "object") {
    return res.status(400).json({ error: "Invalid body" });
  }
  const db = readDB();
  newTask.id = Date.now().toString();
  db.tasks = db.tasks || [];
  db.tasks.push(newTask);
  writeDB(db);
  res.status(201).json(newTask);
});

router.patch("/:id", (req, res) => {
  const db = readDB();
  const idx = (db.tasks || []).findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body };
  writeDB(db);
  res.status(200).json(db.tasks[idx]);
});

router.delete("/:id", (req, res) => {
  const db = readDB();
  const before = (db.tasks || []).length;
  db.tasks = db.tasks.filter((t) => t.id !== req.params.id);
  if (db.tasks.length === before) {
    return res.status(404).json({ error: "Task not found" });
  }
  writeDB(db);
  res.status(204).send();
});

module.exports = router;
