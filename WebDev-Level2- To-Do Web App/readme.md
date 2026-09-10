#  Interactive To-Do Web App

A clean, responsive, client-side To-Do application built with HTML5, CSS3, and Vanilla JavaScript. Designed to manage daily tasks seamlessly with separate views for pending and completed activities, state counts, and persistent browser storage.



##  Features

- **Task Creation:** Quickly add new tasks via an input field and submit button.
- **Dynamic Categorization:** Tasks are split automatically into **Pending** and **Completed** sections.
- **Task Management:**
  - **Complete/Undo:** Toggle tasks between pending and completed states.
  - **Inline Editing:** Edit existing task text directly in the UI.
  - **Deletion:** Permanently remove tasks from either list.
- **Live Task Counters:** Real-time indicators showing active pending ($X$) and completed ($Y$) task totals.
- **Timestamps:** Displays creation and completion dates/times for each entry.
- **Data Persistence:** Uses browser `localStorage` to save state across page refreshes.
- **Empty States:** Friendly feedback messages displayed when a list contains no tasks.
- **Responsive Design:** Mobile-first layout using CSS Grid and Flexbox for seamless cross-device compatibility.

---

##  Tech Stack

- **Structure:** HTML5 (Semantic elements)
- **Styling:** CSS3 (Flexbox, Grid, CSS Custom Properties/Variables)
- **Logic:** JavaScript (Vanilla JS - DOM Manipulation & Web Storage API)

---

##  Project Structure


├── index.html        Semantic HTML layout
├── style.css          Component-based CSS styling and media queries
├── script.js        DOM interaction and state/localStorage logic
└── README.md          Project documentation
