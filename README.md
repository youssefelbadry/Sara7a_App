# 📨 Sara7a App – Backend

Backend system for Sara7a App built with **Node.js, Express.js, MongoDB**, including authentication, OTP verification, file upload with magic-number validation, soft/hard delete, freeze system, logging, and device-based 2FA.

---

## 🚀 Main Features

### 🔐 Authentication
- Sign up / Login
- Access & Refresh tokens
- Token rotation + revocation
- OTP for email verification
- OTP for forget password reset
- Unknown device verification (2FA)

### 👤 User Management
- Update profile image (with magic-number validation)
- Upload cover images
- Freeze / Restore account
- Soft delete / Restore delete
- Auto hard delete after 30 days (Cron Job)
- Dynamic account status (ACTIVE / INACTIVE)

### 🗂 File Upload
- Multer disk storage
- Dynamic folder per user
- Magic number validation (real file type check)

### 💬 Messaging
- Anonymous messaging system
- Virtual population for user messages

### 🛡 Security
- Global error handler
- Helmet
- CORS configuration
- Logging for all requests & responses

---

## 🧬 Project Architecture

