CREATE TABLE IF NOT EXISTS scans (
id INTEGER PRIMARY KEY AUTOINCREMENT,
url TEXT NOT NULL,
status INTEGER,
response_ms INTEGER,
checked_links INTEGER DEFAULT 0,
broken_links INTEGER DEFAULT 0,
created_at TEXT DEFAULT (datetime('now'))
);


CREATE TABLE IF NOT EXISTS scan_details (
id INTEGER PRIMARY KEY AUTOINCREMENT,
scan_id INTEGER NOT NULL,
link TEXT NOT NULL,
status INTEGER,
ok INTEGER,
kind TEXT, -- 'page' | 'asset'
FOREIGN KEY(scan_id) REFERENCES scans(id)
);