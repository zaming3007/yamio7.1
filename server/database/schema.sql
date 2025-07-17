-- Mio Couple Website Database Schema
-- SQLite database for couple data storage

-- Users table (for the couple)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL, -- 'giaminh' or 'baongoc'
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Memory Wall Photos
CREATE TABLE IF NOT EXISTS memory_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    image_data BLOB, -- Store image as base64 if needed
    uploaded_by TEXT NOT NULL, -- 'giaminh' or 'baongoc'
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN DEFAULT FALSE,
    tags TEXT, -- JSON array of tags
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- Couple Goals
CREATE TABLE IF NOT EXISTS couple_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'travel', 'relationship', 'personal', 'shared'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    status TEXT DEFAULT 'not-started', -- 'not-started', 'in-progress', 'completed', 'cancelled'
    target_date DATE,
    completion_date DATE,
    created_by TEXT NOT NULL, -- 'giaminh' or 'baongoc'
    assigned_to TEXT, -- 'giaminh', 'baongoc', or 'both'
    progress INTEGER DEFAULT 0, -- 0-100
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Feedback & Suggestions
CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feedback_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'couple' or 'system'
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL, -- 'giaminh' or 'baongoc'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    status TEXT DEFAULT 'open', -- 'open', 'in-progress', 'completed', 'cancelled'
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES users(user_id)
);

-- Feedback Replies
CREATE TABLE IF NOT EXISTS feedback_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reply_id TEXT UNIQUE NOT NULL,
    feedback_id TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL, -- 'giaminh' or 'baongoc'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(feedback_id),
    FOREIGN KEY (author) REFERENCES users(user_id)
);

-- Love Messages
CREATE TABLE IF NOT EXISTS love_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    sender TEXT NOT NULL, -- 'giaminh' or 'baongoc'
    receiver TEXT NOT NULL, -- 'giaminh' or 'baongoc'
    message_type TEXT DEFAULT 'text', -- 'text', 'image', 'voice'
    is_read BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    scheduled_for DATETIME, -- For scheduled messages
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender) REFERENCES users(user_id),
    FOREIGN KEY (receiver) REFERENCES users(user_id)
);

-- Weather Preferences
CREATE TABLE IF NOT EXISTS weather_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    tracking_mode TEXT DEFAULT 'district', -- 'district' or 'ip'
    location TEXT,
    ip_address TEXT,
    ip_location_data TEXT, -- JSON data
    notifications_enabled BOOLEAN DEFAULT TRUE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Personality Test Results
CREATE TABLE IF NOT EXISTS personality_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    test_type TEXT NOT NULL, -- 'love-language', 'personality', etc.
    results TEXT NOT NULL, -- JSON data
    score INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Activity Logs (for tracking user interactions)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'upload_photo', 'create_goal', 'send_message', etc.
    resource_type TEXT, -- 'photo', 'goal', 'message', etc.
    resource_id TEXT,
    details TEXT, -- JSON data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert default users
INSERT OR IGNORE INTO users (user_id, name, emoji) VALUES 
('giaminh', 'Gia Minh', '🦁'),
('baongoc', 'Bảo Ngọc', '🌸');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memory_photos_uploaded_by ON memory_photos(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_memory_photos_upload_date ON memory_photos(upload_date);
CREATE INDEX IF NOT EXISTS idx_couple_goals_created_by ON couple_goals(created_by);
CREATE INDEX IF NOT EXISTS idx_couple_goals_status ON couple_goals(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_author ON feedbacks(author);
CREATE INDEX IF NOT EXISTS idx_feedbacks_type ON feedbacks(type);
CREATE INDEX IF NOT EXISTS idx_love_messages_sender ON love_messages(sender);
CREATE INDEX IF NOT EXISTS idx_love_messages_receiver ON love_messages(receiver);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
