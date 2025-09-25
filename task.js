const fs = require("fs");
const path = require("path");

const TASKS_FILE = path.join(__dirname, "tasks.json");

// Load task
function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(TASKS_FILE, "utf-8"));
}

// Save tasks to file
function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Add task
function addTask(title) {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now(),
    title,
    status: "todo",
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log("Task added:", title);
}

// Update a task's title
function updateTask(id, newTitle) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id == id);
  if (!task) {
    console.log("Task not found");
    return;
  }
  task.title = newTitle;
  saveTasks(tasks);
  console.log("Task updated:", newTitle);
}

// Delete a task
function deleteTask(id) {
  let tasks = loadTasks();
  const newTasks = tasks.filter((t) => t.id != id);
  if (tasks.length === newTasks.length) {
    console.log("Task not found");
    return;
  }
  saveTasks(newTasks);
  console.log("Task deleted", id);
}

// Change task stat
function changeStatus(id, status) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id == id);
  if (!task) {
    console.log("Task not found");
    return;
  }
  if (!["todo", "in_progress", "done"].includes(status)) {
    console.log("Invalid status.Use : todo | in_progress | done");
    return;
  }
  task.status = status;
  saveTasks(tasks);
  console.log(`Task ${id} marked as ${status}`);
}

// List tasks
function listTasks(filter = null) {
  const tasks = loadTasks();
  let filtered = tasks;

  if (filter) {
    filtered = tasks.filter((t) => t.status === filter);
  }

  if (filtered.length === 0) {
    console.log("No tasks found.");
    return;
  }
  filtered.forEach((task) => {
    console.log(`[${task.status}] (${task.id}) ${task.title}`);
  });
}

// CLI arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "add":
    addTask(args.slice(1).join(" "));
    break;
  case "update":
    updateTask(args[1], args.slice(2).join(" "));
    break;
  case "delete":
    deleteTask(args[1]);
    break;
  case "mark_in_progress":
    changeStatus(args[1], "in_progress");
    break;
  case "mark_done":
    changeStatus(args[1], "done");
    break;
  case "list":
    listTasks();
    break;
  case "list_done":
    listTasks("done");
    break;
  case "list_todo":
    listTasks("todo");
    break;
  case "list_in_progress":
    listTasks("in_progress");
    break;
  default:
    listTasks();
}
