# 🔐 Secure Auth Backend

A production-ready **Node.js authentication backend** featuring JWT-based auth, refresh token rotation, OTP email verification, and multi-session management — built on Express and MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Authentication Flow](#-authentication-flow)
- [API Reference](#-api-reference)
- [Database Models](#️-database-models)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Security Considerations](#-security-considerations)

---

## ✨ Features

- **User Registration** — Username + email + password signup with duplicate detection
- **OTP Email Verification** — Hashed OTP sent via Gmail OAuth2 before account activation
- **JWT Authentication** — Short-lived access tokens (15 min) + long-lived refresh tokens (7 days)
- **Refresh Token Rotation** — Every token refresh invalidates the old token and issues a fresh one
- **Session Management** — Each login creates a DB-tracked session with IP and user-agent metadata
- **Granular Logout** — Revoke the current session or all active sessions at once
- **Secure Cookie Handling** — Refresh tokens stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies
- **SHA-256 Hashing** — Passwords and token hashes never stored in plain text

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js 5.x |
| Database | MongoDB via Mongoose |
| Auth Tokens | jsonwebtoken (JWT) |
| Email | Nodemailer + Gmail OAuth2 |
| Hashing | Node.js built-in `crypto` (SHA-256) |
| Logging | Morgan |

---

## 📁 Project Structure

```
tanishq-mathur35-secure-auth-backend/
├── server.js                  # Entry point — boots DB + Express
└── src/
    ├── app.js                 # Express app setup, middleware, routes
    ├── config/
    │   ├── config.js          # Env validation & config export
    │   └── database.js        # Mongoose connection
    ├── controllers/
    │   └── auth.controller.js # Route handler logic
    ├── models/
    │   ├── user.model.js      # User schema (username, email, password, verified)
    │   ├── session.model.js   # Session schema (refreshTokenHash, ip, userAgent, revoked)
    │   └── otp.model.js       # OTP schema (email, user ref, otpHash)
    ├── routes/
    │   └── auth.routes.js     # Route definitions → controller bindings
    ├── services/
    │   └── email.service.js   # Nodemailer transporter + sendEmail helper
    └── utils/
        └── utils.js           # OTP generator + HTML email template
```

---

## 🔐 Authentication Flow

```
┌─────────┐         ┌──────────┐         ┌──────────┐         ┌─────────┐
│  Client │         │  Server  │         │ Database │         │  Email  │
└────┬────┘         └────┬─────┘         └────┬─────┘         └────┬────┘
     │   POST /register  │                    │                    │
     │──────────────────>│                    │                    │
     │                   │── create user ────>│                    │
     │                   │── create OTP hash─>│                    │
     │                   │─────────────────────────── send OTP ──>│
     │<── 201 Created ───│                    │                    │
     │                   │                    │                    │
     │   POST /verify-email (OTP)             │                    │
     │──────────────────>│                    │                    │
     │                   │── verify hash ────>│                    │
     │                   │── set verified ───>│                    │
     │<── 200 OK ────────│                    │                    │
     │                   │                    │                    │
     │   POST /login     │                    │                    │
     │──────────────────>│                    │                    │
     │                   │── validate creds ─>│                    │
     │                   │── create session ─>│                    │
     │<── accessToken + refreshToken cookie ──│                    │
     │                   │                    │                    │
     │   GET /get-me (Authorization: Bearer <accessToken>)        │
     │──────────────────>│                    │                    │
     │<── user data ─────│                    │                    │
     │                   │                    │                    │
     │   GET /refresh-token (cookie)          │                    │
     │──────────────────>│                    │                    │
     │                   │── rotate token ───>│                    │
     │<── new accessToken + new cookie ───────│                    │
```

---

## 📡 API Reference

Base path: `/api/auth`

### POST `/register`

Registers a new user and sends an OTP to the provided email.

**Request Body**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `201`**
```json
{
  "message": "User registered successfully",
  "user": { "username": "john_doe", "email": "john@example.com", "verified": false }
}
```

---

### POST `/verify-email`

Verifies the user's email using the OTP received in the registration email.

**Request Body**
```json
{
  "email": "john@example.com",
  "otp": "482910"
}
```

**Response `200`**
```json
{
  "message": "Email verified successfully",
  "user": { "username": "john_doe", "email": "john@example.com", "verified": true }
}
```

---

### POST `/login`

Authenticates a verified user. Returns a short-lived access token and sets a `refreshToken` HTTP-only cookie.

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "message": "Logged in successfully",
  "user": { "username": "john_doe", "email": "john@example.com" },
  "accessToken": "<jwt>"
}
```

> **Cookie set:** `refreshToken` — `HttpOnly`, `Secure`, `SameSite=Strict`, 7-day expiry

---

### GET `/get-me`

Returns the currently authenticated user's profile.

**Headers**
```
Authorization: Bearer <accessToken>
```

**Response `200`**
```json
{
  "message": "user fetched successfully",
  "user": { "username": "john_doe", "email": "john@example.com" }
}
```

---

### GET `/refresh-token`

Rotates the refresh token and issues a new access token. Requires the `refreshToken` cookie.

**Response `200`**
```json
{
  "message": "Access token refreshed successfully",
  "accessToken": "<new_jwt>"
}
```

> Old refresh token is invalidated in DB. New `refreshToken` cookie is set.

---

### GET `/logout`

Revokes the current session by marking it as revoked in the database.

**Response `200`**
```json
{ "message": "Logged out successfully" }
```

---

### GET `/logout-all`

Revokes **all** active sessions for the authenticated user across all devices.

**Response `200`**
```json
{ "message": "Logged out from all devices successfully" }
```

---

## 🗄️ Database Models

### `User`

| Field | Type | Notes |
|---|---|---|
| `username` | String | Unique, min 3 chars |
| `email` | String | Unique, lowercase, validated |
| `password` | String | SHA-256 hashed |
| `verified` | Boolean | Default `false` |

### `Session`

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId | Ref → User |
| `refreshTokenHash` | String | SHA-256 of refresh token |
| `ip` | String | Client IP at login |
| `userAgent` | String | Client user-agent at login |
| `revoked` | Boolean | Default `false` |

### `OTP`

| Field | Type | Notes |
|---|---|---|
| `email` | String | Target email |
| `user` | ObjectId | Ref → User |
| `otpHash` | String | SHA-256 of 6-digit OTP |

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Gmail OAuth2 (for Nodemailer)
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
EMAIL_USER=your_gmail_address@gmail.com
```

> **Gmail OAuth2 setup:** Visit [Google Cloud Console](https://console.cloud.google.com/) → Create OAuth 2.0 credentials → Use the [OAuth Playground](https://developers.google.com/oauthplayground) to generate a refresh token scoped to `https://mail.google.com/`.

---

## 🚀 Getting Started

**Prerequisites:** Node.js ≥ 18, MongoDB instance (local or Atlas)

```bash
# 1. Clone the repository
git clone https://github.com/Tanishq-Mathur35/secure-auth-backend.git
cd secure-auth-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in your values in .env

# 4. Start development server (with hot reload)
npm run dev

# 5. Start production server
npm start
```

Server runs on **`http://localhost:3000`** by default.

---

## 🛡 Security Considerations

- **Passwords** are hashed with SHA-256 before storage — plain text is never persisted.
- **Refresh tokens** are stored as SHA-256 hashes in the database; the raw token only lives in an `HttpOnly` cookie, inaccessible to JavaScript.
- **Token rotation** on every refresh prevents refresh token reuse attacks.
- **Session revocation** is immediate — revoking a session invalidates the DB record, making old refresh tokens useless even if stolen.
- **OTPs** are hashed before storage and deleted after successful verification.

> ⚠️ **Note:** For production deployments, consider upgrading password hashing from SHA-256 to `bcrypt` or `argon2`, which are purpose-built for password storage and resistant to brute-force attacks.

---

## 📄 License

[ISC](LICENSE) © [Tanishq Mathur](https://github.com/Tanishq-Mathur35)