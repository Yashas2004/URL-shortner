# SnipIt

A full-stack URL shortener built with the MERN stack (MongoDB, Express, React, Node.js). Users can shorten links, track clicks with detailed analytics (device, browser, location, referrer), generate QR codes, and manage everything from a personal dashboard.

## Features

- **URL shortening** — generate short, unique codes for any valid URL
- **Authentication** — email/password (JWT) and Google OAuth login, both returning the same session shape
- **Dashboard** — create, copy, search, paginate, and delete your links
- **Click analytics** — per-link click log capturing device, browser, OS, country/city, approximate coordinates, and referrer, plus summary counts (top device/browser/country). The analytics modal polls every few seconds for near real-time updates while it's open.
- **QR codes** — generate and download a PNG QR code for any shortened link
- **Dark-mode UI** — animated page/list/modal transitions and a subtly animated background
- **Security** — Helmet security headers, CORS, rate limiting, bcrypt password hashing

## Tech stack

**Frontend**: React 19, Vite, React Router, Tailwind CSS v4, Motion (Framer Motion), lucide-react, @react-oauth/google, qrcode.react

**Backend**: Node.js, Express 5, MongoDB + Mongoose, JSON Web Tokens, bcryptjs, google-auth-library, ua-parser-js, geoip-lite, express-rate-limit, helmet, cors

## Project structure

```
url-shortener/
├── server/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Request handlers (auth, url/click logic)
│   ├── middleware/      # JWT auth guard, error handling
│   ├── models/          # Mongoose schemas (User, Url, Click)
│   ├── routes/          # Express routers
│   ├── utils/           # Short code + JWT generation helpers
│   └── server.js        # App entry point
└── client/
    ├── src/
    │   ├── components/  # Reusable UI (Header, UrlList, modals, etc.)
    │   ├── context/      # AuthContext (login/register/session state)
    │   ├── pages/        # Login, Register, Dashboard
    │   └── utils/        # Centralized fetch wrapper
    └── index.html
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (e.g. a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- (Optional, for Google login) A Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — create an OAuth Client ID of type **Web application** and add your frontend's URL as an authorized JavaScript origin

### 1. Clone and install dependencies

```bash
git clone https://github.com/Yashas2004/URL-shortner.git
cd url-shortener

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env`:

```env
MONGO_URI=your-mongodb-connection-string
PORT=5000
JWT_SECRET=a-long-random-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id   # optional, only needed for Google login
```

Create `client/.env`:

```env
VITE_SERVER_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id   # optional, only needed for Google login
```

`VITE_SERVER_URL` should point at wherever the backend is reachable — swap it to a deployed backend URL if the frontend and backend end up hosted separately.

### 3. Run it

In one terminal:

```bash
cd server
npm run dev
```

In another:

```bash
cd client
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## API overview

| Method | Endpoint                | Auth | Description                                  |
| ------ | ------------------------ | ---- | --------------------------------------------- |
| POST   | `/api/auth/register`     | –    | Create an account                             |
| POST   | `/api/auth/login`        | –    | Log in with email/password                    |
| POST   | `/api/auth/google`       | –    | Log in/register via Google ID token           |
| POST   | `/api/shorten`           | ✅    | Shorten a URL                                 |
| GET    | `/api/urls`              | ✅    | List your URLs (`search`, `page`, `limit`)    |
| DELETE | `/api/urls/:id`          | ✅    | Delete a URL you own                          |
| GET    | `/api/urls/:id/clicks`   | ✅    | Recent clicks + summary for a URL you own     |
| GET    | `/api/stats`             | ✅    | Total links and total clicks for your account |
| GET    | `/:shortCode`            | –    | Redirect to the original URL, logs a click    |

## Known limitations

- **Location accuracy**: click locations are resolved from the visitor's IP address via `geoip-lite`, an offline lookup. This only works for real public IP addresses — requests from `localhost` or a private LAN IP will show "Unknown" and no coordinates, since those addresses have no real-world location. It resolves correctly once the backend is deployed and reached over the public internet.
- **"Real-time" analytics** is implemented via polling (every 4 seconds while the analytics modal is open), not a persistent WebSocket connection — there can be a few seconds of lag before a new click appears.


## try it:

https://url-shortener-snipit.vercel.app/
