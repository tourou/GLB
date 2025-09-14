-- YouWare Creator Forum Database Schema

-- Users table: Store user profile information
CREATE TABLE users (
  encrypted_yw_id TEXT PRIMARY KEY NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  bio TEXT,
  level TEXT DEFAULT '初心者',
  points INTEGER DEFAULT 0,
  join_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_active TEXT DEFAULT CURRENT_TIMESTAMP
) STRICT;

-- Posts table: Store questions, guides, and showcase items
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('qa', 'howto', 'showcase')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT, -- JSON array of tags
  status TEXT DEFAULT 'published' CHECK(status IN ('published', 'draft', 'resolved')),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(encrypted_yw_id)
) STRICT;

-- Comments table: Store answers and responses to posts
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_best_answer INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(encrypted_yw_id)
) STRICT;

-- User badges table: Store achievement badges
CREATE TABLE user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  badge_type TEXT NOT NULL CHECK(badge_type IN ('gold', 'silver', 'bronze')),
  badge_name TEXT NOT NULL,
  description TEXT,
  earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(encrypted_yw_id)
) STRICT;

-- Friendships table: Store user relationships
CREATE TABLE friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  friend_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'blocked')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(encrypted_yw_id),
  FOREIGN KEY (friend_id) REFERENCES users(encrypted_yw_id),
  UNIQUE(user_id, friend_id)
) STRICT;

-- User points log table: Track point changes
CREATE TABLE user_points_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(encrypted_yw_id)
) STRICT;