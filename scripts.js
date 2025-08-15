/**
 * Base URL of the Kanban API.
 * @constant {string}
 */
const API_URL = "https://jsl-kanban-api.vercel.app/";

/**
 * Array storing the current list of tasks.
 * Initially loaded from localStorage or set as an empty array.
 * @type {Array<Object>}
 */
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; //Checks for tasks in localstorage.

/**
 * ID of the currently selected task for editing or other operations.
 * @type {string|null}
 */
let selectedTaskId = null; //Holds ID of current task.

// === SHOW LOADING MESSAGE BRIEFLY ===
/**
 * Displays the loading banner briefly for 500ms.
 * Useful for giving quick feedback to the user after actions like saving or loading data.
 */
function showLoadingMessageBriefly() {
  console.log("showLoadingMessageBriefly() called"); //
  const loadingBanner = document.getElementById("loading-banner");
  if (!loadingBanner) return;
  loadingBanner.classList.add("show");
  setTimeout(() => {
    loadingBanner.classList.remove("show");
  }, 500);
}

//==== Fetch Tasks From API ====
/**
 * Fetches the latest tasks from the Kanban API and updates the local `tasks` array.
 * - Sorts tasks by priority after fetching.
 * - Saves tasks to localStorage for offline use.
 * - Renders the updated tasks on the page.
 * @async
 * @returns {Promise<void>}
 */
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

//====Storing in LocalStorage =====
/**
 * Saves the current `tasks` array into localStorage as a JSON string.
 */
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==== SORTING LOGIC BASED ON PRIORITY====

/**
 * Sorts the `tasks` array by priority while keeping tasks from different statuses separate.
 *
 * Priority order (highest to lowest): high → medium → low → any undefined/other priority.
 * Tasks in different statuses remain in their original order relative to each other.
 *
 * @example
 * // Before:
 * tasks = [
 *   { status: "todo", priority: "low" },
 *   { status: "todo", priority: "high" }
 * ];
 * sortTasksByPriority();
 * // After:
 * tasks = [
 *   { status: "todo", priority: "high" },
 *   { status: "todo", priority: "low" }
 * ];
 */

function sortTasksByPriority() {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => {
    if (a.status !== b.status) return 0; // keep different statuses separate
    const aPriority = priorityOrder[a.priority?.toLowerCase()] || 4;
    const bPriority = priorityOrder[b.priority?.toLowerCase()] || 4;
    return aPriority - bPriority;
  });
}

/**
 * Creates a DOM element representing a single task, including:
 * - Task title
 * - Priority indicator (red/orange/green dot)
 * - Click handler to open task details in a modal
 *
 * @param {Object} task - The task data.
 * @param {string} task.id - Unique identifier of the task.
 * @param {string} task.title - Task title to be displayed.
 * @param {string} [task.priority] - Priority level ("high", "medium", "low").
 * @param {string} [task.status] - Status/column where the task belongs.
 * @returns {HTMLDivElement} - A fully constructed task element ready to append to the DOM.
 */
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.dataset.taskId = task.id;

  const titleEl = document.createElement("div");
  titleEl.textContent = task.title;
  taskDiv.appendChild(titleEl);

  // Priority text in corner (top-right)
  if (task.priority) {
    const priorityEl = document.createElement("span");
    // Priority text + color indicator
    if (task.priority) {
      const priorityWrapper = document.createElement("div");
      priorityWrapper.className = "priority-wrapper";

      const priorityIndicator = document.createElement("span");
      priorityIndicator.className = "priority-indicator";

      const priorityText = task.priority.toLowerCase();

      if (priorityText === "high") {
        priorityEl.textContent = "🔴";
      } else if (priorityText === "medium") {
        priorityEl.textContent = "🟠";
      } else if (priorityText === "low") {
        priorityEl.textContent = "🟢";
      }
      taskDiv.appendChild(priorityEl);
    }

    priorityEl.classList.add("priority-label"); // add a CSS class for styling
    taskDiv.appendChild(priorityEl);
  }

  taskDiv.addEventListener("click", () => {
    openTaskModal(task);
  });

  return taskDiv;
}

/**
 * Finds the DOM container element where tasks of a given status should be displayed.
 *
 * @param {string} status - The status/category of tasks (e.g., "todo", "in-progress", "done").
 * @returns {HTMLElement|null} - The `.tasks-container` element inside the matching column, or null if not found.
 *
 * @example
 * const todoContainer = getTaskContainerByStatus("todo");
 * if (todoContainer) {
 *   todoContainer.appendChild(createTaskElement(myTask));
 * }
 */
function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}

/**
 * Clears all tasks from every `.tasks-container` in the DOM.
 * This is typically called before re-rendering the task list to prevent duplicates.
 */
function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });
}

/**==============
 Rendering Tasks 
=================*/
/**
 * Renders all tasks to the DOM, grouped by their status.
 * - Clears existing tasks from the UI.
 * - Updates the column headers with task counts.
 * - Appends each task element to the correct status container.
 *
 * @param {Array<Object>} tasksArray - List of tasks to be rendered.
 * @param {string} tasksArray[].id - Unique identifier of the task.
 * @param {string} tasksArray[].title - Task title.
 * @param {string} [tasksArray[].description] - Optional task description.
 * @param {string} tasksArray[].status - Task status ("todo", "doing", "done").
 * @param {string} [tasksArray[].priority] - Task priority ("high", "medium", "low").
 */
function renderTasks(tasksArray) {
  clearExistingTasks();

  // Count tasks per status
  const counts = { todo: 0, doing: 0, done: 0 };
  tasksArray.forEach((task) => {
    counts[task.status] = (counts[task.status] || 0) + 1;
  });
  document.getElementById("toDoText").textContent = `TODO (${counts.todo})`;
  document.getElementById("doingText").textContent = `DOING (${counts.doing})`;
  document.getElementById("doneText").textContent = `DONE (${counts.done})`;

  // Render tasks in appropriate containers
  tasksArray.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) {
      container.appendChild(createTaskElement(task));
    }
  });
}

/**
 * Opens the task modal and pre-fills it with the given task's details.
 *
 * @param {Object} task - Task object containing the details to edit.
 * @param {string} task.id - Unique identifier of the task.
 * @param {string} task.title - Task title.
 * @param {string} [task.description] - Optional task description.
 * @param {string} task.status - Task status ("todo", "doing", "done").
 * @param {string} [task.priority] - Task priority ("high", "medium", "low").
 */
function openTaskModal(task) {
  selectedTaskId = task.id;
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-desc").value = task.description;
  document.getElementById("task-status").value = task.status;
  document.getElementById("task-priority").value = task.priority || "";
  document.getElementById("task-modal").showModal();
}

/**
 * Sets up the event listener for the "Update Task" button.
 * - Validates the form input.
 * - Updates the selected task in the `tasks` array.
 * - Sorts and saves tasks to localStorage.
 * - Re-renders tasks in the UI.
 * - Closes the task modal upon successful update.
 */
function setupUpdateTaskHandler() {
  const updateBtn = document.getElementById("update-task-btn");
  updateBtn.addEventListener("click", () => {
    if (selectedTaskId !== null) {
      const title = document.getElementById("task-title").value.trim();
      const description = document.getElementById("task-desc").value.trim();
      const status = document.getElementById("task-status").value;
      const priority = document.getElementById("task-priority").value.trim();

      // Validation
      if (!title) {
        alert("Title is required!"); //alert to fill in title if empty string.
        return;
      }

      // Find and update the task
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
        // Close modal and reset selected task
        document.getElementById("task-modal").close();
        selectedTaskId = null;
      }
    }
  });
}

/**
 * Sets up the event listener for deleting a task.
 * - Confirms with the user before deletion.
 * - Removes the selected task from the `tasks` array.
 * - Saves the updated task list to localStorage.
 * - Re-renders the task list in the UI.
 * - Closes the task modal after deletion.
 */
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

/**
 * Sets up event listeners for closing modals.
 * - Closes the task modal and resets the selected task when the close button is clicked.
 * - Closes the add-task modal when its close button is clicked.
 */
function setupModalCloseHandlers() {
  document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("task-modal").close();
    selectedTaskId = null;
  });

  /**================
   NEW MODAL
   ==================*/
  document
    .querySelector("#add-task-modal .close-btn")
    .addEventListener("click", () => {
      document.getElementById("add-task-modal").close();
    });
}
/**
 * Sets up the submit handler for the "Add Task" form.
 * - Prevents default form submission.
 * - Validates that the task title is provided.
 * - Generates a new unique task ID.
 * - Adds the new task to the `tasks` array.
 * - Sorts tasks by priority.
 * - Saves updated tasks to localStorage.
 * - Renders tasks in the UI.
 * - Resets the form and closes the add-task modal.
 */
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
    // Generate a unique ID for the new task
    const nextId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newTask = { id: nextId, title, description, status, priority };
   
    // Add, sort, save, and render the task list
    tasks.push(newTask);
    sortTasksByPriority();
    saveTasksToLocalStorage();
    renderTasks(tasks);

    addTaskForm.reset();
    document.getElementById("add-task-modal").close();
  });
}
/**
 * Initializes the Kanban task board on page load.
 * - Shows a brief loading banner.
 * - Loads tasks from API if none are stored locally.
 * - Sorts and renders existing tasks if available.
 * - Sets up modal close, add, update, and delete task handlers.
 */

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

/**
 * Starts the Kanban board when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", initTaskBoard);

/**
 * Opens the "Add Task" modal when the add-task button is clicked.
 */
document.getElementById("open-add-task-btn").addEventListener("click", () => {
  document.getElementById("add-task-modal").showModal();
});
