const API_URL = "https://jsl-kanban-api.vercel.app/";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;

// === SHOW LOADING MESSAGE BRIEFLY ===
function showLoadingMessageBriefly() {
  console.log("showLoadingMessageBriefly() called");
  const loadingBanner = document.getElementById("loading-banner");
  if (!loadingBanner) return;
  loadingBanner.classList.add("show");
  setTimeout(() => {
    loadingBanner.classList.remove("show");
  }, 500);
}

async function fetchTasksFromAPI() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    tasks = data;
    sortTasksByPriority();
    saveTasksToLocalStorage();
    renderTasks(tasks);
  } catch (err) {
    console.error("Error fetching tasks from API:", err);
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// === SORTING LOGIC ===
function sortTasksByPriority() {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => {
    if (a.status !== b.status) return 0; // keep different statuses separate
    const aPriority = priorityOrder[a.priority?.toLowerCase()] || 4;
    const bPriority = priorityOrder[b.priority?.toLowerCase()] || 4;
    return aPriority - bPriority;
  });
}

function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.dataset.taskId = task.id;

  // Title
  const titleEl = document.createElement("div");
  titleEl.textContent = task.title;
  taskDiv.appendChild(titleEl);

  // Priority text in corner (top-right)
  if (task.priority) {
    const priorityEl = document.createElement("span");
    priorityEl.textContent = task.priority;
    priorityEl.classList.add("priority-label"); // add a CSS class for styling
    taskDiv.appendChild(priorityEl);
  }

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
  document.getElementById("task-priority").value = task.priority || "";
  document.getElementById("task-modal").showModal();
}

function setupUpdateTaskHandler() {
  const updateBtn = document.getElementById("update-task-btn");
  updateBtn.addEventListener("click", () => {
    if (selectedTaskId !== null) {
      const title = document.getElementById("task-title").value.trim();
      const description = document.getElementById("task-desc").value.trim();
      const status = document.getElementById("task-status").value;
      const priority = document.getElementById("task-priority").value.trim();

      if (!title) {
        alert("Title is required!");
        return;
      }

      const index = tasks.findIndex((t) => t.id === selectedTaskId);
      if (index > -1) {
        tasks[index] = {
          ...tasks[index],
          title,
          description,
          status,
          priority,
        };
        sortTasksByPriority();
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
      const confirmed = confirm("Are you sure you want to delete this task?");
      if (confirmed) {
        tasks = tasks.filter((t) => t.id !== selectedTaskId);
        saveTasksToLocalStorage();
        renderTasks(tasks);
        document.getElementById("task-modal").close();
        selectedTaskId = null;
      }
    }
  });
}

function setupModalCloseHandlers() {
  document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("task-modal").close();
    selectedTaskId = null;
  });

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
    const priority = document.getElementById("new-task-priority").value.trim();

    if (!title) {
      alert("Task title is required!");
      return;
    }

    const nextId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newTask = { id: nextId, title, description, status, priority };

    tasks.push(newTask);
    sortTasksByPriority();
    saveTasksToLocalStorage();
    renderTasks(tasks);

    addTaskForm.reset();
    document.getElementById("add-task-modal").close();
  });
}

function initTaskBoard() {
  showLoadingMessageBriefly();
  if (tasks.length === 0) {
    fetchTasksFromAPI();
  } else {
    sortTasksByPriority();
    renderTasks(tasks);
  }

  setupModalCloseHandlers();
  setupAddTaskFormHandler();
  setupUpdateTaskHandler();
  setupDeleteTaskHandler();
}

document.addEventListener("DOMContentLoaded", initTaskBoard);

document.getElementById("open-add-task-btn").addEventListener("click", () => {
  document.getElementById("add-task-modal").showModal();
});
