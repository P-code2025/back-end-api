const cors = require("cors"); // Import the cors middleware
const { send } = require("httpie");

// VÌ BẠN KHÔNG THỂ DÙNG FILE HỆ THỐNG TRÊN RENDER,
// CHÚNG TA SẼ DÙNG MỘT MẢNG TRONG BỘ NHỚ LÀM NƠI LƯU TRỮ TẠM THỜI.
// LƯU Ý: DỮ LIỆU SẼ BỊ XÓA SAU MỖI LẦN TRIỂN KHAI HOẶC KHỞI ĐỘNG LẠI.
let tasks = [];

// Middleware CORS
const corsHandler = cors();

module.exports = async (req, res) => {
  // Apply CORS middleware
  corsHandler(req, res, async () => {
    const { url, method } = req;
    const parts = url.split("/").filter(Boolean);
    const apiPath = "/api/tasks";

    // Helper to handle response
    const sendResponse = (statusCode, data) => {
      res.status(statusCode).json(data);
    };

    // GET all tasks or a single task
    if (method === "GET") {
      if (url === apiPath) {
        return sendResponse(200, tasks);
      }
      const taskId = parts[parts.length - 1];
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        return sendResponse(200, task);
      }
      return sendResponse(404, { error: "Task not found" });
    }

    // POST a new task
    if (method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const newTask = JSON.parse(body);
          newTask.id = Date.now().toString();
          tasks.push(newTask);
          sendResponse(201, newTask);
        } catch (error) {
          sendResponse(400, { error: "Invalid JSON" });
        }
      });
      return;
    }

    // PATCH to update a task
    if (method === "PATCH") {
      const taskId = parts[parts.length - 1];
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const patch = JSON.parse(body);
          const taskIndex = tasks.findIndex((t) => t.id === taskId);
          if (taskIndex > -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...patch };
            sendResponse(200, tasks[taskIndex]);
          } else {
            sendResponse(404, { error: "Task not found" });
          }
        } catch (error) {
          sendResponse(400, { error: "Invalid JSON" });
        }
      });
      return;
    }

    // DELETE a task
    if (method === "DELETE") {
      const taskId = parts[parts.length - 1];
      const initialLength = tasks.length;
      tasks = tasks.filter((t) => t.id !== taskId);
      if (tasks.length < initialLength) {
        return sendResponse(204, null);
      }
      return sendResponse(404, { error: "Task not found" });
    }

    // Handle 405 Method Not Allowed
    sendResponse(405, { error: "Method Not Allowed" });
  });
};
