// Thay thế toàn bộ đoạn code GET hiện tại
if (method === "GET") {
  // Xử lý route /api/tasks để lấy tất cả tasks
  if (parts[parts.length - 1] === "tasks") {
    return sendResponse(200, db.tasks);
  }
  // Xử lý route /api/tasks/:id để lấy một task cụ thể
  const taskId = parts[parts.length - 1];
  const task = db.tasks.find((t) => t.id === taskId);
  if (task) {
    return sendResponse(200, task);
  }
  return sendResponse(404, { error: "Task not found" });
}
