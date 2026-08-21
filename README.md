# SkySecure — Website Security Scanner

SkySecure is a full-stack web application that scans any public website and returns an
easy-to-understand security risk score ranging from **5 to 100**. Enter a URL and get a
detailed report covering SSL/TLS configuration, known phishing records, suspicious domain
patterns, security headers, and actionable recommendations.

The project exposes a scanner as a **standalone React Start server function** (deployed on
Vercel) and also ships a **Python (Flask) backend** exposing the same logic over a REST API.

---

## Features

- **Security risk score (5–100)** with an intuitive `Low` / `Medium` / `High` rating.
- **SSL / TLS inspection** — certificate validity, issuing CA, and days until expiry.
- **PhishTank integration** — checks whether the URL is a verified phishing page.
- **Google Safe Browsing integration** — flags malware, phishing/social engineering,
  unwanted software, and potentially harmful applications (requires an API key).
- **Suspicious-domain detection** — a keyword engine catches credential-harvesting and
  brand-impersonation patterns (e.g. `login-verify`, `bank-update`).
- **Internal threat blacklist** for known simulated phishing / scam domains.
- **Security header audit** — warns about missing `Content-Security-Policy` and
  `X-Frame-Options` response headers.
- **Actionable recommendations** tailored to each finding.
- **SSRF protection** — refuses to scan domains that resolve to private / internal / link-local
  IP ranges (loopback, `10.*`, `172.16-31.*`, `192.168.*`, `169.254.*`, etc.).
- Simulated-scan support for demo / unreachable domains for testing without risk.

---

## Architecture

```
┌─────────────────────────────┐       ┌──────────────────────────────┐
│  Frontend (React / Vite)    │       │  Backend (Flask, optional)   │
│  src/lib/scan.ts            │  (REST)│  /api/scan                  │
│  Server-fn scanner (Vercel) │◀────── │  scanner/*                  │
└─────────────┬───────────────┘       └──────────────────────────────┘
              │
              ├──▶ TLS/HTTPS inspection
              ├──▶ PhishTank API
              ├──▶ Google Safe Browsing API
              └──▶ Blacklist + keyword engine
```

Two interchangeable scan engines are implemented:

1. **TypeScript / React Start server function** (`frontend/src/lib/scan.ts`) — the primary
   engine, runs as a Vercel serverless function. It is self-contained and does not depend on
   the Python backend.
2. **Python / Flask** (`backend/`) — a standalone REST backend with the equivalent logic
   (`scanner/ssl_check.py`, `scanner/url_fetch.py`, `scanner/risk_engine.py`, etc.).

---

## Technology Stack

### Frontend
- [React](https://react.dev) 19 + [TypeScript](https://www.typescriptlang.org) 5
- [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router)
- [Vite](https://vitejs.dev) 8, [Nitro](https://nitro.unjs.io) (Vercel preset)
- [Tailwind CSS](https://tailwindcss.com) 4, [shadcn/ui](https://ui.shadcn.com) components
- [TanStack Query](https://tanstack.com/query), [recharts](https://recharts.org), [zod](https://zod.dev)

### Backend (Python)
- [Flask](https://flask.palletsprojects.com) 3, Flask-CORS
- `requests` for URL fetching and PhishTank lookups

---

## Getting Started

### Prerequisites
- Node.js 20+ and npm / [Bun](https://bun.sh)
- Python 3.9+ (only required for the optional Flask backend)
- A [Google Safe Browsing API key](https://developers.google.com/safe-browsing/v4/get-started)
  *(optional — score only, skip for a free API-less demo)*

### Frontend (primary, self-contained)

```bash
cd frontend
npm install

# set the optional Google Safe Browsing key (server-side only)
# e.g. create a .env file with:
#   GOOGLE_SAFE_BROWSING_KEY=your_key_here

npm run dev        # start the dev server
```

Open the printed URL (default `http://localhost:3000`).

### Backend (optional — REST API alternative)

```bash
cd backend
pip install -r requirements.txt
python app.py       # serves on http://localhost:5000
```

### Running from the repo root (deploy build)

```bash
npm run build       # installs deps, builds the frontend, emits Vercel output
```

---

## Configuration

| Variable | Where | Default | Description |
| --- | --- | --- | --- |
| `GOOGLE_SAFE_BROWSING_KEY` | Frontend (server) | — | Google Safe Browsing API key. Absent = clean-browsing check is skipped. |
| `PORT` | Backend | `5000` | Server listen port. |
| `HOST` | Backend | `0.0.0.0` | Server bind host. |
| `SCAN_TIMEOUT` | Backend | `5.0` | Request timeout (seconds). |
| `MAX_REDIRECTS` | Backend | `5` | Maximum redirects followed. |
| `FLASK_ENV` | Backend | `development` | Enables debug mode in development. |

> The Google Safe Browsing key is read **only on the server** and never exposed to the browser.

---

## API (Backend)

### `POST /api/scan`

Scan a website and return a security report.

**Request**
```json
{ "url": "https://example.com" }
```

**Response** (200)
```json
{
  "id": "uuid",
  "url": "https://example.com",
  "score": 87,
  "risk": "Low",
  "ssl": { "valid": true, "issuer": "DigiCert Inc", "expiresInDays": 83 },
  "findings": [
    { "title": "Secure Connection (HTTPS Enabled)", "severity": "Low", "description": "..." }
  ],
  "recommendations": [],
  "tags": [],
  "scannedAt": "2026-08-21T12:00:00.000Z"
}
```

- `400` — missing or invalid/restricted URL.
- `500` — internal error while scanning.

### `GET /health`

```json
{ "status": "healthy", "timestamp": "...", "service": "SkySecure Backend API" }
```

---

## Project Structure

```
security-scanner/
├── backend/                    # Optional Flask API
│   ├── app.py                  # Flask app factory (CORS, health, error handlers)
│   ├── config.py               # Environment-based configuration
│   ├── requirements.txt
│   ├── routes/
│   │   └── scan_routes.py      # POST /api/scan orchestration
│   ├── scanner/                # Scan logic
│   │   ├── keyword_db.py       # Blacklist + suspicious-keyword engine
│   │   ├── phishtank.py        # PhishTank API client
│   │   ├── risk_engine.py      # Scoring, findings, recommendations
│   │   ├── ssl_check.py        # TLS certificate inspection
│   │   └── url_fetch.py        # HTTP header / reachability fetch
│   └── utils/
│       └── helpers.py          # URL validation + SSRF protection
├── frontend/                   # React / Vite / TanStack Start app
│   ├── src/
│   │   ├── components/         # Navbar, ScanForm, ResultCard, ui/
│   │   ├── lib/scan.ts         # Primary TS scan engine (Vercel server fn)
│   │   ├── routes/             # File-based TanStack routes
│   │   └── styles.css
│   └── vite.config.ts
└── package.json                # Root build script (Vercel deployment)
```

---

## How the Score Works

The scan starts at **100** and deducts points per issue (never falling below 5):

| Check | Deduction |
| --- | --- |
| Blacklisted domain | −90 |
| Known PhishTank phishing host | −80 |
| Google Safe Browsing threat | −85 × threat types |
| No HTTPS | −30 |
| Invalid / untrusted SSL cert | −25 |
| Suspicious keyword in hostname | −25 each |
| SSL expiring < 30 days | −10 |
| Missing CSP / X-Frame-Options headers | −10 |

**Risk level:** `Low` (score ≥ 80), `Medium` (score ≥ 50), `High` (score < 50).

---

## Security Notes

- The backend and server function both enforce **SSRF protection**, rejecting URLs that
  point at local or private network ranges.
- Network scans run with short timeouts so a slow or offline site cannot hang the app.
- The Google Safe Browsing API key lives server-side only.
- The `BLACKLISTED_DOMAINS` list targets **demo/simulated** phishing sites used for
  development and is not intended as a substitute for a community threat feed.

---
