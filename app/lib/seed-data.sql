-- Extended D1 Database Seed Data for Production Demo
-- Run this with: wrangler d1 execute security-demo-db --remote --file=./app/lib/seed-data.sql

-- Additional Users
INSERT OR IGNORE INTO users (id, username, password, email, role) VALUES 
    (5, 'alice_wonder', 'alice2024!', 'alice@company.com', 'user'),
    (6, 'bob_builder', 'bobpass123', 'bob@construction.com', 'user'),
    (7, 'charlie_day', 'charlie@123', 'charlie@philly.com', 'admin'),
    (8, 'diana_prince', 'wonderwoman', 'diana@themyscira.com', 'user'),
    (9, 'eve_online', 'eve12345', 'eve@tech.com', 'user'),
    (10, 'frank_castle', 'punisher', 'frank@marvel.com', 'user'),
    (11, 'grace_hopper', 'compiler', 'grace@navy.mil', 'admin'),
    (12, 'henry_ford', 'modelt1913', 'henry@ford.com', 'user');

-- Additional Comments with various XSS payloads
INSERT OR IGNORE INTO comments (id, user_id, content, created_at) VALUES 
    (4, 5, 'This is a great demo! <img src=x onerror=alert(1)>', datetime('now', '-2 days')),
    (5, 6, 'I love the security features! <svg onload=alert(2)>', datetime('now', '-1 day')),
    (6, 7, 'Can someone help me with authentication? <iframe src=javascript:alert(3)>', datetime('now', '-12 hours')),
    (7, 8, 'Found a vulnerability! <body onload=alert(4)>', datetime('now', '-6 hours')),
    (8, 9, 'Testing the comment system. <input onfocus=alert(5) autofocus>', datetime('now', '-1 hour')),
    (9, 10, 'The admin page is at /admin', datetime('now', '-30 minutes')),
    (10, 11, 'Just completed my security training!', datetime('now', '-15 minutes'));

-- Sample Orders for Insecure Design demo
INSERT OR IGNORE INTO orders (id, status, payment_verified, created_at) VALUES 
    ('ORD-2024-001', 'confirmed', 1, datetime('now', '-7 days')),
    ('ORD-2024-002', 'pending', 0, datetime('now', '-6 days')),
    ('ORD-2024-003', 'confirmed', 1, datetime('now', '-5 days')),
    ('ORD-2024-004', 'confirmed', 0, datetime('now', '-4 days')),
    ('ORD-2024-005', 'cancelled', 0, datetime('now', '-3 days')),
    ('ORD-2024-006', 'pending', 0, datetime('now', '-2 days')),
    ('ORD-2024-007', 'confirmed', 1, datetime('now', '-1 day')),
    ('ORD-2024-008', 'shipped', 1, datetime('now', '-12 hours'));

-- Auth logs showing failed attempts
INSERT OR IGNORE INTO logs (id, action, username, password, success, timestamp) VALUES 
    (1, 'login_attempt', 'admin', 'password123', 0, datetime('now', '-30 days')),
    (2, 'login_attempt', 'admin', 'admin123', 0, datetime('now', '-29 days')),
    (3, 'login_attempt', 'admin', 'qwerty', 0, datetime('now', '-28 days')),
    (4, 'login_attempt', 'admin', 'letmein', 0, datetime('now', '-27 days')),
    (5, 'login_attempt', 'admin', 'SuperSecret123!', 1, datetime('now', '-26 days')),
    (6, 'login_attempt', 'john_doe', 'password123', 1, datetime('now', '-25 days')),
    (7, 'login_attempt', 'unknown', 'guess123', 0, datetime('now', '-24 hours')),
    (8, 'login_attempt', 'root', 'root123', 0, datetime('now', '-12 hours')),
    (9, 'login_attempt', 'test', 'test123', 0, datetime('now', '-6 hours')),
    (10, 'login_attempt', 'admin', 'password', 0, datetime('now', '-1 hour'));

-- More settings for CSRF demo
INSERT OR IGNORE INTO settings (id, key, value, updated_at) VALUES 
    (4, 'api_rate_limit', '1000', datetime('now')),
    (5, 'session_timeout', '3600', datetime('now')),
    (6, 'allowed_origins', '*', datetime('now')),
    (7, 'feature_flags', '{"new_ui": true, "beta_api": false}', datetime('now')),
    (8, 'notification_email', 'admin@security-demo.local', datetime('now'));
