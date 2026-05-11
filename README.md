<div align="center">

# 🔐 Secure Auth Backend

A full-stack authentication system — Node.js + Express backend with a Vite + React frontend.  
JWT refresh token rotation · OTP email verification · Multi-session management.

[![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Frontend-Vite+React-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

</div>

---

## Project structure

```bash
secure-auth-backend/
├── backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── config.js          # env validation
│       │   └── database.js        # Mongoose connection
│       ├── controllers/
│       │   └── auth.controller.js
│       ├── models/
│       │   ├── user.model.js
│       │   ├── session.model.js
│       │   └── otp.model.js
│       ├── routes/
│       │   └── auth.routes.js
│       ├── services/
│       │   └── email.service.js
│       └── utils/
│           └── utils.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/
        │   └── axios.js           # axios instance (withCredentials)
        ├── context/
        │   └── AuthContext.jsx    # global auth state
        ├── components/
        │   └── AuthVisual.jsx     # left panel with feature list
        └── pages/
            ├── RegisterPage.jsx
            ├── VerifyPage.jsx     # 6-digit OTP input
            ├── LoginPage.jsx
            └── DashboardPage.jsx
```

---

## What's inside

| Feature            | Detail                                                        |
| ------------------ | ------------------------------------------------------------- |
| Registration       | Username + email + password with duplicate detection          |
| Email verification | SHA-256 hashed OTP via Gmail OAuth2                           |
| JWT auth           | 15-min access tokens + 7-day refresh tokens                   |
| Token rotation     | Every refresh invalidates the old token                       |
| Session tracking   | IP + user-agent stored per login                              |
| Logout             | Revoke current session or all devices at once                 |
| Cookie security    | `HttpOnly` · `Secure` · `SameSite=Strict`                     |
| Frontend           | Vite + React · OTP input · Token inspector · Session controls |

---

## Tech stack

|              | Layer     | Technology                               |
| ------------ | --------- | ---------------------------------------- |
| **Backend**  | Runtime   | Node.js (ESM)                            |
|              | Framework | Express.js 5.x                           |
|              | Database  | MongoDB + Mongoose                       |
|              | Tokens    | jsonwebtoken                             |
|              | Email     | Nodemailer + Gmail OAuth2                |
|              | Hashing   | Node.js `crypto` — SHA-256               |
|              | Logging   | Morgan                                   |
| **Frontend** | Bundler   | Vite                                     |
|              | UI        | React 18                                 |
|              | HTTP      | Axios (withCredentials)                  |
|              | Routing   | React state machine (no external router) |

---

## Authentication flow

```
Client                Server                 DB              Email
  │                     │                    │                 │
  │── POST /register ──>│                    │                 │
  │                     │── create user ────>│                 │
  │                     │── store OTP hash ─>│                 │
  │                     │────────────────────────── send OTP ─>│
  │<── 201 ─────────────│                    │                 │
  │                     │                    │                 │
  │── POST /verify-email (OTP) ─────────────>│                 │
  │                     │── match hash ─────>│                 │
  │                     │── set verified ───>│                 │
  │<── 200 ─────────────│                    │                 │
  │                     │                    │                 │
  │── POST /login ──────>│                   │                 │
  │                     │── validate creds ─>│                 │
  │                     │── create session ─>│                 │
  │<── accessToken + refreshToken cookie ────│                 │
  │                     │                    │                 │
  │── GET /get-me (Bearer token) ───────────>│                 │
  │<── user data ────────│                   │                 │
  │                     │                    │                 │
  │── GET /refresh-token (cookie) ──────────>│                 │
  │                     │── rotate + save ──>│                 │
  │<── new accessToken + new cookie ─────────│                 │
```

---

## API reference

Base path: `/api/auth`

### `POST /register`

```json
// Request
{ "username": "john_doe", "email": "john@example.com", "password": "secret123" }

// Response 201
{ "message": "User registered successfully", "user": { "username": "john_doe", "email": "john@example.com", "verified": false } }
```

### `POST /verify-email`

```json
// Request
{ "email": "john@example.com", "otp": "482910" }

// Response 200
{ "message": "Email verified successfully", "user": { "verified": true } }
```

### `POST /login`

```json
// Request
{ "email": "john@example.com", "password": "secret123" }

// Response 200  — also sets HttpOnly refreshToken cookie
{ "message": "Logged in successfully", "accessToken": "<jwt>" }
```

### `GET /get-me`

```
Authorization: Bearer <accessToken>
```

```json
// Response 200
{ "user": { "username": "john_doe", "email": "john@example.com" } }
```

### `GET /refresh-token`

Requires `refreshToken` cookie. Rotates the token pair — old token is immediately invalidated.

```json
// Response 200
{ "accessToken": "<new_jwt>" }
```

### `GET /logout`

Revokes the current session.

### `GET /logout-all`

Revokes every active session across all devices.

---

## Database models

**User**

| Field      | Type    | Notes               |
| ---------- | ------- | ------------------- |
| `username` | String  | Unique, min 3 chars |
| `email`    | String  | Unique, lowercase   |
| `password` | String  | SHA-256 hashed      |
| `verified` | Boolean | Default `false`     |

**Session**

| Field              | Type     | Notes                    |
| ------------------ | -------- | ------------------------ |
| `user`             | ObjectId | Ref → User               |
| `refreshTokenHash` | String   | SHA-256 of refresh token |
| `ip`               | String   | Client IP at login       |
| `userAgent`        | String   | Client user-agent        |
| `revoked`          | Boolean  | Default `false`          |

**OTP**

| Field     | Type     | Notes                  |
| --------- | -------- | ---------------------- |
| `email`   | String   | Target email           |
| `user`    | ObjectId | Ref → User             |
| `otpHash` | String   | SHA-256 of 6-digit OTP |

---

## Environment variables

Create `backend/.env`:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Gmail OAuth2
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
EMAIL_USER=your_gmail_address@gmail.com
```

> **Gmail OAuth2 setup:** [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 credentials → [OAuth Playground](https://developers.google.com/oauthplayground) → scope `https://mail.google.com/`

---

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

> The frontend Vite config proxies `/api` → `http://localhost:3000` automatically. No CORS setup needed in development.

---

## Security notes

- **Passwords** — SHA-256 hashed before storage. Never persisted in plaintext.
- **Refresh tokens** — stored as SHA-256 hashes. Raw token only lives in an `HttpOnly` cookie, inaccessible to JS.
- **Token rotation** — every `/refresh-token` call invalidates the previous token, blocking replay attacks.
- **Session revocation** — immediate DB update; stolen refresh tokens become useless the moment a session is revoked.
- **OTPs** — hashed before storage, deleted after successful verification.

> ⚠️ **Production note:** SHA-256 is intentionally fast, which is a weakness for password storage. Upgrade to `bcrypt` or `argon2` before going live — they're purpose-built to resist brute-force attacks.

---

## License

[ISC](LICENSE) © [Tanishq Mathur](https://github.com/Tanishq-Mathur35)
