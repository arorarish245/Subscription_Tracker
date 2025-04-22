# 📦 Subscription Tracker Backend

A powerful backend service to manage and track recurring subscriptions like Netflix, Spotify, etc., with auto-expiry, email reminders, and user authentication.

---

## ⚙️ Tech Stack

- **Node.js + Express.js** – Server & API
- **MongoDB + Mongoose** – Database
- **JWT** – Authentication
- **Nodemailer** – Email handling
- **Redis (Upstash)** – Caching or token storage
- **Arcjet** – Bot protection & rate limiting

---

## ✨ Features

- 🔐 **User Authentication** (Login, Register, JWT Tokens)
- 🧾 **Subscription Management** (Add, edit, delete, filter)
- 🔁 **Auto-renewal Logic** – Automatically calculates renewal dates
- ⌛ **Status Updates** – Auto-expiry based on current date
- 💌 **Email Notifications** – Email templates for subscription alerts
- 🧠 **Category & Frequency Support** – Filter subscriptions by use case
- 🧱 **Modular Architecture** – Scalable, clean folder structure
- 🧃 **Upstash Redis Integration** – For session/token/data caching
- 🧷 **Arcjet Middleware** – Protects routes from abuse
- 📦 **Environment-Based Configuration**

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/subscription-tracker.git
cd subscription-tracker
npm install
cp .env.example .env       # Add MONGO_URI, JWT_SECRET, etc.
npm run dev
