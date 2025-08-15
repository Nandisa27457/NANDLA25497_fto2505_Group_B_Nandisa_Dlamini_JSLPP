// Elements
const sidebar = document.getElementById("side-bar-div");
const layout = document.getElementById("layout");
const hideBtn = document.getElementById("hide-sidebar-btn");
const showBtn = document.getElementById("show-sidebar-btn");

let isTopbarOpen = false; // For mobile toggle state

// Hide sidebar (desktop)
hideBtn.addEventListener("click", () => {
  sidebar.classList.add("hidden");;
  showBtn.style.display = "block";
});

// Show sidebar (desktop)
showBtn.addEventListener("click", () => {
  sidebar.classList.remove("hidden");
  showBtn.style.display = "none";
});

// Toggle topbar on mobile when clicking logo
const logoMobile = document.querySelector(".logo-mobile");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("topbar-close");

// Open topbar modal on mobile logo click
logoMobile.addEventListener("click", () => {
  sidebar.classList.add("topbar");
  overlay.classList.add("active");
});

// Close modal on close button or overlay click
closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("topbar");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("topbar");
  overlay.classList.remove("active");
});

