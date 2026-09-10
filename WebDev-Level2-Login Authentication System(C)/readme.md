# Full-Stack Login Authentication System (Python/Flask)
A sleek, fully functional web application demonstrating secure user authentication, registration, and account recovery. This project is built using Python with the Flask web framework, SQLite for database storage, and styled with modern CSS as a personal portfolio showcase.

# Features
Secure User Registration: Validates inputs (e.g., strong passwords) and hashes credentials before storage.

Encrypted Login: Uses scrypt hashing (via werkzeug.security) to protect user passwords against breaches.

Session Management: Implements secure, stateful sessions to manage user access to protected routes (e.g., Dashboard).

Forgot/Reset Password: Complete workflow allowing users to recover their accounts securely.

Modern Personal Landing Page: Styled without emojis, featuring a professional dark theme and a personalized profile highlight.

Full CSS Dark Theme: A clean, minimal dark UI applied across all templates.

SQLite Database: Lightweight, file-based SQL database integrated directly into the Flask ecosystem.

Input Validation: Ensures required fields are present and data follows specified formats (e.g., minimum password length).

Flash Messaging: Provides dynamic feedback (success, warnings, errors) to users during actions.

# Tech Stack
Backend: Python 3 (built with Python 3.14.7)

Framework: Flask

Database: SQLite3

Authentication/Security: Werkzeug Security (generate_password_hash, check_password_hash)

Templating: Jinja2

Frontend: HTML5, CSS3
