

// ===== Dark/Light Mode Toggle =====
// Dark/Light mode toggle
/** @type {HTMLInputElement} Checkbox or switch that toggles the theme */
const themeToggle = document.getElementById("theme-toggle");

/** @type {HTMLImageElement} Logo image element that changes based on theme */
const logoImg = document.getElementById("logo");  // Make sure your logo img has id="logo"


// Define your light and dark logo image paths
/** @type {string} Path to the light mode logo image */
const lightLogo = "./assets/logo-light.svg";

/** @type {string} Path to the dark mode logo image */
const darkLogo = "./assets/logo-dark.svg";

/**
 * Sets the theme on page load based on the saved value in localStorage.
 * Also updates the logo image accordingly.
 */
// Load saved theme from localStorage and set logo accordingly
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.checked = true;
  logoImg.src = darkLogo;
} else {
  logoImg.src = lightLogo;
}

/**
 * Event listener for theme toggle changes.
 * Updates the `body` class, stores the theme in localStorage,
 * and switches the logo image based on the selected mode.
 */
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
