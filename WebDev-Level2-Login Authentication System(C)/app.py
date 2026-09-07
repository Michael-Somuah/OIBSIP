import re
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
app.secret_key = 'super_secret_session_key_change_me'

DATABASE = 'database.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        conn.commit()

init_db()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash("Please log in to access this page.", "danger")
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def is_valid_password(password):
    if len(password) < 8:
        return False
    if not re.search(r"\d", password):
        return False
    return True

@app.route('/')
def home():
    # Render the landing page for all visitors
    return render_template('landing.html', username=session.get('username'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        if not username or not password:
            flash("All fields are required.", "danger")
            return render_template('register.html', username=username)

        if not is_valid_password(password):
            flash("Password must be at least 8 characters long and contain at least 1 number.", "danger")
            return render_template('register.html', username=username)

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            flash("Username or Email already registered. Please use another or log in.", "danger")
            return render_template('register.html')

        hashed_password = generate_password_hash(password, method='scrypt')
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()

        flash("Registration successful! Please log in.", "success")
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        if not username or not password:
            flash("Please fill in both fields.", "danger")
            return render_template('login.html')

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

        if user is None or not check_password_hash(user['password'], password):
            flash("Invalid username/email or password.", "danger")
            return render_template('login.html', username=username)

        session['user_id'] = user['id']
        session['username'] = user['username']
        flash("Logged in successfully!", "success")
        return redirect(url_for('dashboard'))

    return render_template('login.html')

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

        if user:
            # Store username temporarily in session to allow setting a new password
            session['reset_username'] = username
            return redirect(url_for('reset_password'))
        else:
            flash("Username not found.", "danger")

    return render_template('forgot_password.html')

@app.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    username = session.get('reset_username')
    
    if not username:
        flash("Unauthorized reset attempt. Please start from Forgot Password.", "danger")
        return redirect(url_for('forgot_password'))

    if request.method == 'POST':
        new_password = request.form.get('password', '').strip()
        confirm_password = request.form.get('confirm_password', '').strip()

        if new_password != confirm_password:
            flash("Passwords do not match.", "danger")
            return render_template('reset_password.html', username=username)

        if not is_valid_password(new_password):
            flash("Password must be at least 8 characters long and contain at least 1 number.", "danger")
            return render_template('reset_password.html', username=username)

        hashed_password = generate_password_hash(new_password, method='scrypt')
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET password = ? WHERE username = ?", (hashed_password, username))
        conn.commit()

        session.pop('reset_username', None)
        flash("Password updated successfully! Please log in with your new password.", "success")
        return redirect(url_for('login'))

    return render_template('reset_password.html', username=username)

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', username=session.get('username'))

@app.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out.", "info")
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)