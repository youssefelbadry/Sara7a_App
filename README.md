# 📨 Sara7a App – Backend

Backend system for Sara7a App built with **Node.js, Express.js, MongoDB**, including authentication, OTP verification, file upload with magic-number validation, soft/hard delete system, account freeze logic, logging, and device-based 2FA.

---

## 🚀 Main Features

### 🔐 Authentication
- Sign up / Login
- Access & Refresh Tokens
- Token Rotation & Revocation
- OTP for Email Verification
- OTP for Password Reset
- Unknown Device Verification (2FA)

### 👤 User Management
- Update Profile Image (Magic-Number Validation)
- Upload Cover Images
- Freeze / Restore Account
- Soft Delete / Restore Account
- Auto Hard Delete after 30 Days (Cron Job)
- Dynamic Account Status (ACTIVE / INACTIVE)

### 🗂 File Upload
- Multer Disk Storage
- Dynamic Folder per User
- Magic-Number Validation (Real File Type Check)

### 💬 Messaging
- Anonymous Messaging System
- Virtual Population for User Messages

### 🛡 Security
- Global Error Handler
- Helmet Integration
- CORS Configuration
- Logging for All Requests & Responses

---

## 🧬 Project Architecture
- Modular Structure
- Middleware-Based Authentication
- Clean Code Organization
- Scalable Folder Structure
