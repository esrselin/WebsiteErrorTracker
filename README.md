# 🌐 Website Error Tracker  

*A lightweight Website Error Tracker using JavaScript, HTML, CSS, and Node.js to detect and log partner website issues (HTTP errors, broken links, slow responses). Implemented SQLite for scan history and status tracking.*
Built with **JavaScript, HTML, CSS, Node.js, Express, SQLite**.  


## 🚀 Features  
-  Scan any website URL and check its **HTTP status**  
-  Measure **response time** in milliseconds  
-  Detect **broken links** (404/500 errors) and failed assets (JS, CSS, images)  
-  Save results to a **SQLite database** for history tracking  
-  View scan history and details via REST API or simple dashboard  
-  Built with **vanilla JS frontend** (fast, no heavy framework)  

---

## 🛠️ Tech Stack  
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express  
- **Database**: SQLite  
- **Parsing**: Cheerio  

---
## ⚡ Quick Start  

```bash
# 1) Clone the repo
git clone https://github.com/<your-username>/website-error-tracker.git
cd website-error-tracker

# 2) Install dependencies
npm install

# 3) (Optional) Configure
echo "PORT=3000\nSCAN_TIMEOUT_MS=10000" > .env

# 4) Run in dev mode
npm run dev

http://localhost:3000

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| POST   | `/api/scan`     | Scan a website `{ url }`   |
| GET    | `/api/history`  | Recent scans (limit=20)    |
| GET    | `/api/scan/:id` | Details of a specific scan |

