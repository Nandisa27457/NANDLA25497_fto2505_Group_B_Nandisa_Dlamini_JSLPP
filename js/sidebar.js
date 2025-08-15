// Elements
/** @type {HTMLElement} The sidebar container element */
const sidebar = document.getElementById("side-bar-div");

/** @type {HTMLElement} The main layout container */
const layout = document.getElementById("layout");

/** @type {HTMLElement} Button to hide the sidebar (desktop view) */
const hideBtn = document.getElementById("hide-sidebar-btn");

/** @type {HTMLElement} Button to show the sidebar (desktop view) */
const showBtn = document.getElementById("show-sidebar-btn");

/**
 * Tracks the state of the topbar on mobile.
 * @type {boolean}
 */
let isTopbarOpen = false; // For mobile toggle state

// ===== Desktop Sidebar Toggle =====

/**
 * Hides the sidebar in desktop view and shows the "show sidebar" button.
 */
hideBtn.addEventListener("click", () => {
  sidebar.classList.add("hidden");;
  showBtn.style.display = "block";
});

/**
 * Shows the sidebar in desktop view and hides the "show sidebar" button.
 */
showBtn.addEventListener("click", () => {
  sidebar.classList.remove("hidden");
  showBtn.style.display = "none";
});


// ===== Mobile Topbar Toggle =====

// Toggle topbar on mobile when clicking logo
/** @type {HTMLElement} Mobile logo element used to open the topbar menu */
const logoMobile = document.querySelector(".logo-mobile");

/** @type {HTMLElement} Overlay element for topbar modal */
const overlay = document.getElementById("overlay");

/** @type {HTMLElement} Close button for the mobile topbar */
const closeBtn = document.getElementById("topbar-close");

/**
 * Opens the mobile topbar menu when the mobile logo is clicked.
 * Adds the "topbar" class to the sidebar and activates the overlay.
 */
// Open topbar modal on mobile logo click
logoMobile.addEventListener("click", () => {
  sidebar.classList.add("topbar");
  overlay.classList.add("active");
});

/**
 * Closes the mobile topbar menu when the close button is clicked.
 * Removes the "topbar" class from the sidebar and deactivates the overlay.
 */// Close modal on close button or overlay click
closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("topbar");
  overlay.classList.remove("active");
});

/**
 * Closes the mobile topbar menu when the overlay is clicked.
 * Removes the "topbar" class from the sidebar and deactivates the overlay.
 */
overlay.addEventListener("click", () => {
  sidebar.classList.remove("topbar");
  overlay.classList.remove("active");
});

