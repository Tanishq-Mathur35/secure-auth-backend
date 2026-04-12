# 🔐 Secure Auth Backend

A Node.js authentication backend implementing **JWT-based authentication**, **session management**, and **OTP email verification** using MongoDB.

---

## 🚀 Features

- 🔑 User registration with email & password
- 📧 Email verification via OTP
- 🔐 JWT authentication (access + refresh tokens)
- 🧠 Session management with database tracking
- 🚪 Logout (single session & all sessions)
- 🔄 Refresh token rotation
- 🍪 Secure HTTP-only cookie handling

---

## 🧠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **jsonwebtoken (JWT)**
- **Nodemailer (Gmail OAuth2)**
- **Crypto (SHA256 hashing)**

---

## 📁 Project Structure

```bash
Secure-auth-backend/
│
├── node_modules/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```bash
MONGO_URI=
JWT_SECRET=

CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=
EMAIL_USER=
```

## 📡 API Endpoints

### Auth Routes → `/api/auth`

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | /register      | Register new user      |
| POST   | /login         | Login user             |
| GET    | /get-me        | Get current user       |
| GET    | /refresh-token | Refresh access token   |
| GET    | /logout        | Logout current session |
| GET    | /logout-all    | Logout all sessions    |
| GET    | /verify-email  | Verify email via OTP   |

---

## 🔐 Authentication Flow

1. User registers → OTP sent to email
2. User verifies email using OTP
3. User logs in → receives:
    - Access Token (15 min)
    - Refresh Token (HTTP-only cookie)
4. Refresh token generates new access tokens
5. Sessions stored in DB and can be revoked

---

## 🗄️ Database Models

### User

- username
- email
- password
- verified

### Session

- user
- refreshTokenHash
- ip
- userAgent
- revoked

### OTP

- email
- user
- otpHash

---

## ▶️ Running the Project

```bash
npm install
npm run dev
```
