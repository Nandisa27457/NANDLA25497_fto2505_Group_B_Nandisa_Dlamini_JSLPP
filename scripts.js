const API_URL = "https://jsl-kanban-api.vercel.app/";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;

// === SHOW LOADING MESSAGE BRIEFLY ===
function showLoadingMessageBriefly() {
  console.log("showLoadingMessageBriefly() called");
  const loadingBanner = document.getElementById("loading-banner");
  if (!loadingBanner) return; // Prevents errors if banner not in HTML
  loadingBanner.classList.add("show");
  setTimeout(() => {
    loadingBanner.classList.remove("show");
  }, 500); // Half a second
}

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

  return taskDiv;
}

function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}

function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });
}

function renderTasks(tasksArray) {
  clearExistingTasks();

  // Update task counts in headers
  const counts = { todo: 0, doing: 0, done: 0 };
  tasksArray.forEach((task) => {
    counts[task.status] = (counts[task.status] || 0) + 1;
  });
  document.getElementById("toDoText").textContent = `TODO (${counts.todo})`;
  document.getElementById("doingText").textContent = `DOING (${counts.doing})`;
  document.getElementById("doneText").textContent = `DONE (${counts.done})`;

  tasksArray.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) {
      container.appendChild(createTaskElement(task));
    }
  });
}

function openTaskModal(task) {
  selectedTaskId = task.id;
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-desc").value = task.description;
  document.getElementById("task-status").value = task.status;
  document.getElementById("task-modal").showModal();
}

function setupUpdateTaskHandler() {
  const updateBtn = document.getElementById("update-task-btn");
  updateBtn.addEventListener("click", () => {
    if (selectedTaskId !== null) {
      const title = document.getElementById("task-title").value.trim();
      const description = document.getElementById("task-desc").value.trim();
      const status = document.getElementById("task-status").value;

      if (!title) {
        alert("Title is required!");
        return;
      }

      const index = tasks.findIndex((t) => t.id === selectedTaskId);
      if (index > -1) {
        tasks[index] = { ...tasks[index], title, description, status };
        saveTasksToLocalStorage();
        renderTasks(tasks);
        document.getElementById("task-modal").close();
        selectedTaskId = null;
      }
    }
  });
}

function setupDeleteTaskHandler() {
  const deleteBtn = document.getElementById("delete-task-btn");
  deleteBtn.addEventListener("click", () => {
    if (selectedTaskId !== null) {
      // Show native confirm dialog
      const confirmed = confirm("Are you sure you want to delete this task?");
      if (confirmed) {
        tasks = tasks.filter((t) => t.id !== selectedTaskId);
        saveTasksToLocalStorage();
        renderTasks(tasks);
        document.getElementById("task-modal").close();
        selectedTaskId = null;
      }
      // else do nothing if cancelled
    }
  });
}

function setupModalCloseHandlers() {
  // Close Task Details modal
  document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("task-modal").close();
    selectedTaskId = null;
  });

  // Close Add Task modal
  document
    .querySelector("#add-task-modal .close-btn")
    .addEventListener("click", () => {
      document.getElementById("add-task-modal").close();
    });
}

function setupAddTaskFormHandler() {
  const addTaskForm = document.getElementById("add-task-form");

  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("new-task-title").value.trim();
    const description = document.getElementById("new-task-desc").value.trim();
    const status = document.getElementById("new-task-status").value;

    if (!title) {
      alert("Task title is required!");
      return;
    }

    // Generate next unique ID
    const nextId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newTask = { id: nextId, title, description, status };

    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks(tasks);

    addTaskForm.reset();
    document.getElementById("add-task-modal").close();
  });
}

function initTaskBoard() {
  // Always show banner briefly on refresh
  showLoadingMessageBriefly();
  if (tasks.length === 0) {
    fetchTasksFromAPI();
  } else {
    renderTasks(tasks);
  }

  setupModalCloseHandlers();
  setupAddTaskFormHandler();
  setupUpdateTaskHandler();
  setupDeleteTaskHandler();
}

document.addEventListener("DOMContentLoaded", initTaskBoard);

// Open Add Task modal when button is clicked
document.getElementById("open-add-task-btn").addEventListener("click", () => {
  document.getElementById("add-task-modal").showModal();
});
