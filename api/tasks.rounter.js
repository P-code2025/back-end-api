const { Router } = require("express");

let tasks = [];

const router = Router();

// GET /api/tasks
router.get("/", (req, res) => {
  res.status(200).json(tasks);
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.status(200).json(task);
});

// POST /api/tasks
router.post("/", (req, res) => {
  const newTask = req.body;
  if (!newTask || typeof newTask !== "object") {
    return res.status(400).json({ error: "Invalid body" });
  }
  newTask.id = Date.now().toString();
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id
router.patch("/:id", (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  tasks[idx] = { ...tasks[idx], ...req.body };
  res.status(200).json(tasks[idx]);
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== req.params.id);
  if (tasks.length === before)
    return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
});

module.exports = router;
