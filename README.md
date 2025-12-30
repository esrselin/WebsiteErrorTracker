# Website Error Tracker

Website Error Tracker is a lightweight web application designed to scan and monitor websites for common issues such as HTTP errors, broken links, failed assets, and slow response times. It provides both a simple web interface and REST APIs for tracking scan history and detailed results.

The project is built with **Node.js**, **Express**, **SQLite**, and a minimal **vanilla JavaScript** frontend, focusing on simplicity, performance, and clarity.

---

## 🚀 Features

- Scan any website URL and retrieve its HTTP status  
- Measure server response time in milliseconds  
- Detect broken internal links and failed assets (JS, CSS, images)  
- Analyze up to 20 links and assets per scan  
- Persist scan results and history using SQLite  
- View latest scan results and historical data via REST API  
- Simple and clean frontend built without heavy frameworks  

---

## 🧱 Architecture Overview

```

WebsiteErrorTracker/
│
├── public/              # Frontend files
│   ├── index.html       # Main UI
│   ├── app.js           # Frontend logic
│   └── styles.css       # Styling
│
├── sql/
│   └── init.sql         # Database schema
│
├── db.js                # SQLite connection and initialization
├── server.js            # Express server and API routes
├── package.json         # Dependencies and scripts
└── README.md

````

## 🛠 Tech Stack

**Frontend**
- HTML
- CSS
- Vanilla JavaScript

**Backend**
- Node.js
- Express

**Database**
- SQLite (WAL mode enabled)

**Utilities**
- Cheerio (HTML parsing)
- node-fetch (HTTP requests)
- dotenv (environment variables)

---

## ⚡ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/esrselin/WebsiteErrorTracker.git
cd WebsiteErrorTracker
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
SCAN_TIMEOUT_MS=10000
```

### 4️⃣ Start the application

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## 🌐 Frontend Usage

1. Open the application in your browser
2. Enter a full website URL (including `https://`)
3. Click **Scan**
4. View:

   * Latest scan result
   * Historical scan list
   * Response time, broken links, and asset status

---

## 🔌 API Endpoints

### Scan a Website

**POST** `/api/scan`

```json
{
  "url": "https://example.com"
}
```

**Response**

```json
{
  "id": 1,
  "url": "https://example.com",
  "status": 200,
  "response_ms": 312,
  "checked_links": 12,
  "broken_links": 1
}
```

---

### Get Scan Details

**GET** `/api/scan/:id`

Returns the scan summary and all checked links/assets.

---

### Get Scan History

**GET** `/api/history?limit=20`

Returns the most recent scans.

---

## 🗄 Database Schema

### `scans`

| Column        | Type    | Description             |
| ------------- | ------- | ----------------------- |
| id            | INTEGER | Primary key             |
| url           | TEXT    | Scanned URL             |
| status        | INTEGER | HTTP status             |
| response_ms   | INTEGER | Response time           |
| checked_links | INTEGER | Number of checked links |
| broken_links  | INTEGER | Number of broken links  |
| created_at    | TEXT    | Timestamp               |

### `scan_details`

| Column  | Type    | Description        |
| ------- | ------- | ------------------ |
| scan_id | INTEGER | Foreign key        |
| link    | TEXT    | Checked URL        |
| status  | INTEGER | HTTP status        |
| ok      | INTEGER | 1 = OK, 0 = Broken |
| kind    | TEXT    | page / asset       |

---

## ⚠️ Limitations

* Not intended for large-scale crawling
* Limited to 20 links/assets per scan
* No authentication or multi-user support
* Designed for learning, demos, and lightweight monitoring

---

## 📌 Future Improvements

* Scheduled scans (cron support)
* Authentication & multi-tenant support
* Export results (CSV / JSON)
* UI improvements and charts
* Configurable crawl depth

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request
