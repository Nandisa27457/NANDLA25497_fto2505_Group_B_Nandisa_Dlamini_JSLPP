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
const logoImg = document.getElementById("logo");  // Make sure your logo img has id="logo"

// Define your light and dark logo image paths
const lightLogo = "./assets/logo-light.svg";
const darkLogo = "./assets/logo-dark.svg";

// Load saved theme from localStorage and set logo accordingly
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.checked = true;
  logoImg.src = darkLogo;
} else {
  logoImg.src = lightLogo;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    logoImg.src = darkLogo;
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    logoImg.src = lightLogo;
  }
});
