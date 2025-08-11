// Elements
const sidebar = document.getElementById("side-bar-div");
const layout = document.getElementById("layout");
const hideBtn = document.getElementById("hide-sidebar-btn");
const showBtn = document.getElementById("show-sidebar-btn");

// Hide sidebar
hideBtn.addEventListener("click", () => {
  sidebar.classList.add("hidden");
  layout.classList.add("full-width");
  showBtn.style.display = "block";
});

// Show sidebar
showBtn.addEventListener("click", () => {
  sidebar.classList.remove("hidden");
  layout.classList.remove("full-width");
  showBtn.style.display = "none";
});
