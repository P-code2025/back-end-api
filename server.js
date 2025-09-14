// server.js
const express = require("express");
const cors = require("cors");
const tasksHandler = require("./api/tasks");

const app = express();
app.use(cors());
app.use(express.json());

// Mount route
app.all("/api/tasks/:id?", tasksHandler);

// Route test
app.get("/", (req, res) => {
  res.send("API is running");
});

// Lắng nghe cổng Render cấp
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
