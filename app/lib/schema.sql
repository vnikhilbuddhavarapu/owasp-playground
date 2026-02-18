-- D1 Database Schema for Security Demo App
-- Run this with: wrangler d1 execute security-demo-db --local --file=./app/lib/schema.sql

-- Users table for SQL injection demos
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comments table for XSS demos
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Settings table for CSRF demos
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Logs table for auth failures demo
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    username TEXT,
    password TEXT,
    success INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table for insecure design demo
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    status TEXT,
    payment_verified INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed data
INSERT OR IGNORE INTO users (id, username, password, email, role) VALUES 
    (1, 'admin', 'SuperSecret123!', 'admin@security-demo.local', 'admin'),
    (2, 'john_doe', 'password123', 'john@example.com', 'user'),
    (3, 'jane_smith', 'qwerty', 'jane@example.com', 'user'),
    (4, 'test_user', 'test123', 'test@test.com', 'user');

INSERT OR IGNORE INTO comments (id, user_id, content, created_at) VALUES 
    (1, 1, 'Welcome to the security demo! Try to find vulnerabilities.', '2024-01-01 10:00:00'),
    (2, 2, 'This is a normal comment.', '2024-01-02 14:30:00'),
    (3, 3, 'I love this app! <script>alert("Stored XSS")</script>', '2024-01-03 09:15:00');

INSERT OR IGNORE INTO settings (id, key, value, updated_at) VALUES 
    (1, 'site_name', 'Security Demo App', '2024-01-01 00:00:00'),
    (2, 'allow_registration', 'true', '2024-01-01 00:00:00'),
    (3, 'debug_mode', 'false', '2024-01-01 00:00:00');
