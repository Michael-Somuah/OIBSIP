├── Task-1-Calculator/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Task-2-Tribute-Page/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Task-3-Todo-App/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── Task-4-Auth-System/
    ├── app.py
    ├── templates/
    │   ├── register.html
    │   ├── login.html
    │   └── dashboard.html
    └── static/
        └── style.cssThis repository contains my task submissions for the Oasis Infobyte internship program.






 Project Details
01. Arithmetic Calculator
A clean, grid-layout browser calculator built without using unsafe native evaluation functions.

Highlights:

Custom mathematical logic built using state variables instead of eval().

Sequential operations and operator chaining (e.g., 5 + 3 × 2).

Safety checks for division by zero displaying user-friendly error state.

Clean layout using CSS Grid and DOM event listeners (addEventListener).




02. Kwame Nkrumah — A Tribute
An editorial, human-centered tribute page reflecting on the life and legacy of Dr. Kwame Nkrumah.

Highlights:

Rich narrative structure covering early life, studies abroad, political career, and Pan-African legacy.

Styled milestone cards highlighting major historical events from 1909 to 1972.

Clean editorial typography pairing serif headings with sans-serif body text.

High-contrast color palette and fully responsive layouts.







03. Interactive To-Do Web App
A state-driven task manager that lets users track daily tasks across lifecycle states.

Highlights:

Dual-list architecture separating active pending tasks from completed items.

Full CRUD functionality: Add, inline edit, toggle status, and delete.

Live status counters ("X pending", "Y completed") and automatic timestamps.

Persistent storage using browser localStorage to survive page reloads.




04. Flask Login & Authentication System
A Python backend web application enforcing secure registration, authentication, and access control.

Highlights:

Built using Python (Flask) with server-side session management.

Secure password hashing using standard cryptographic utilities (werkzeug.security).

Strict validation enforcing password rules (8+ characters, at least 1 digit) and checking duplicate accounts.

Protected dashboard route with automatic redirection for unauthenticated requests.

Generic error messages to prevent credential guessing during login.




Running the Flask App (Task 4)

Navigate to the authentication system directory:
open Task-4-Auth-System

Create and activate a virtual environment:
python3 -m venv venv
source venv/bin/activate 
On Windows: venv\Scripts\activate

Install dependencies:
pip install flask

Start the server:
python app.py
