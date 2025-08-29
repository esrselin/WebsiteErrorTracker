# Website Error Tracker
A tiny Node.js + React-less (vanilla JS) app that scans a URL, records the HTTP status, response time, and samples up to 20 links/assets to flag potential issues. Stores history in SQLite.


## Tech
- Frontend: JavaScript, HTML, CSS (no framework to keep it small)
- Backend: Node.js, Express
- Database: SQLite (SQL skills ✅)
- Parsing: Cheerio


## Quick Start
```bash
# 1) Clone
git clone https://github.com/<your-username>/website-error-tracker.git
cd website-error-tracker


# 2) Install deps
npm install


# 3) (Optional) Configure
# echo "PORT=3000\nSCAN_TIMEOUT_MS=10000" > .env


# 4) Run
npm run dev
# open http://localhost:3000

Endpoints

POST /api/scan { url } → triggers a scan

GET /api/history?limit=20 → recent scans

GET /api/scan/:id → scan + details JSON

Notes

For speed, we check a small sample of links/assets (config in server.js).

Some servers block HEAD; we fallback to GET.

This is a learning/demo tool, not a full crawler.

CV Snippet

Developed a lightweight Website Error Tracker using JavaScript, HTML, CSS, and Node.js to detect and log partner website issues (HTTP errors, broken links, slow responses). Implemented SQLite for scan history and status tracking.