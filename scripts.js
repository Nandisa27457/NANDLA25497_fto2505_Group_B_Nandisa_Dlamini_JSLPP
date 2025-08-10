const API_URL = "https://jsl-kanban-api.vercel.app/";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;

// Fetch from API only if localStorage empty
async function fetchTasksFromAPI() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    tasks = data;
    saveTasksToLocalStorage();
    renderTasks(tasks);
  } catch (err) {
    console.error("Error fetching tasks from API:", err);
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id;

  taskDiv.addEventListener("click", () => {
    openTaskModal(task);
  });
