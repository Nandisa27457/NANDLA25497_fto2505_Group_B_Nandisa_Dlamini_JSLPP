# JSL Portfolio Piece: Kanban App Deployment & Features Implementation

This project involves deploying a Kanban app to Netlify, ensuring the app's functionality and persistence through local storage, and implementing dynamic features such as task editing, deletion, sidebar interaction, and a theme toggle. The goal is to deliver a fully functional, deployable application that is responsive across devices and maintains data consistency. Students will also focus on clean, modular code that is well-documented for future development.


## Features

- **Fetching** new initial data from API provided.
- **Persistent storage** in localStorage (tasks remain after page refresh)

- *Edit and delete tasks**, including priority

- **Opening and closing sidebar** using a hide and show sidebar button.

- **Mobile** access of topbar from logo image.

 **Add new tasks** with:
  - Title
  - Description
  - Status (To Do, In Progress, Done)
  - Priority (High / Medium / Low)
- **Priority dots** on each task card:
  - 🔴 High priority
  - 🟠 Medium priority
  - 🟢 Low priority
- **Automatic sorting** of tasks within each column:
  - High → Medium → Low

-**Toggle** between light and dark mode.


- **Responsive design** for desktop and mobile

## Installation

## Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/task-board.git
   cd task-board
   ````
2. Open the project in VS Code or your preferred editor.

3. Run locally by opening index.html in your browser.
## Usage/Examples

1. Adding a Task

Click the "Add Task" button.

Fill in:

Task title

Task description

Status

Priority level

Click Save — the task will appear in the correct column.

2. Understanding Priority Dots

🔴 High → Top priority, appears first in its column.

🟠 Medium → Medium urgency.

🟢 Low → Lowest urgency.

The dots are displayed in the top-right corner of each task card.

3. Sorting by Priority

Tasks are automatically sorted High → Medium → Low within each column.

Sorting is applied:

On page load

When adding a new task

When editing an existing task

4. Data Persistence

All tasks are saved in localStorage.

Closing or refreshing the page will not delete your tasks.

5. Click on the task card and make changes to title/description/Status or Priority and submit on save changes.

6. Click task card and submit delete task, then confirm that you want to delete the task, and the task will immediately be removed from the task board.


7. Deployment

This app is then deployed to Netlify, or Vercel by uploading the entire project folder.
## File Structure

````
kanban-task-board/
│
├── index.html               # Main entry point
│
├── css/
│   ├── style.css             # Main stylesheet
│ 
│
├── js/
│   ├── scripts.js            # Main app logic
│   ├── sidebar.js            # Sidebar features.
│   └── dark-mode.js          # Dark-mode toggle features.
│
├── assets/
│   ├── images/               # Any images or backgrounds
│   └── logo.png
│
├── README.md                 # Project documentation
````

## Presentation 


[Loom Presentation](<https://www.loom.com/share/f4262476f4864dc6b7dc2947991eafc2?sid=f18dc0cc-fa78-46fa-b54f-04f3e5fda9c1>)

