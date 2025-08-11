// Sidebar toggle
const sidebar = document.getElementById("side-bar-div");
const hideBtn = document.getElementById("hide-sidebar-btn");
const showBtn = document.getElementById("show-sidebar-btn");

hideBtn.addEventListener("click", () => {
  sidebar.classList.add("hidden");
  showBtn.style.display = "block";
});

showBtn.addEventListener("click", () => {
  sidebar.classList.remove("hidden");
  showBtn.style.display = "none";
});

// Dark/Light mode toggle
const themeToggle = document.getElementById("theme-toggle");

// Load saved theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});
