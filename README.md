# 📝 Notes Web App (MERN)

A full-stack Notes Web Application built using the MERN stack with secure authentication, email verification, and password reset functionality.

---

## 🧧🧧 Features

* 🔐 JWT Authentication
* 📧 Email Verification
* 🔁 Resend Verification Email
* 🔑 Forgot & Reset Password
* 🛡️ Rate Limiting (Security)
* 🧾 User-specific Notes
* ✏️ Create, Read, Update, Delete (CRUD)
* 🔒 Protected Routes
* 🌙 Dark Mode UI
* ⚡ Toast notifications for feedback

---

# 💻 Tech Stack

### 🚀 Frontend
<p align="left">
  <img src="https://skillicons.dev/icons?i=react,tailwind,javascript" />
</p>

---

### ⚙️ Backend
<p align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />
</p>

---

### 🔐 Authentication & Security

![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![Joi](https://img.shields.io/badge/Joi-Validation-blue?style=for-the-badge)

![Express Rate Limit](https://img.shields.io/badge/Express-Rate_Limit-green?style=for-the-badge)

---

### 📧 Email Service

![Nodemailer](https://img.shields.io/badge/Nodemailer-Emails-0A66C2?style=for-the-badge&logo=gmail&logoColor=white)
---

## 🌐 Live Demo

🧧 Frontend: https://note-app-omega-pied.vercel.app/  
🧧 Backend: https://dashboard.render.com/project/prj-d7dneln41pts73a5dfqg

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/nitin01924/note-app.git
cd note-app 
```
### 2. Setup Backend
```bash
cd Backend
npm install
```
## Create a .env file inside Backend:
* PORT=3000
* MONGO_URI=your_mongodb_connection_string
* JWT_SECRET=your_secret_key
* BREVO_API_KEY=your_brevo_api_key
* BREVO_SENDER_EMAIL=your@email@brevo
* CLIENT_URL=http://localhost:5173

## Run backend:
```bash
npm run dev
```
## 3. Setup Frontend
```bash
cd Frontend
npm install
```
## Create a .env file inside Frontend:
* Main 
```bash
VITE_API_URL=https://note-app-backend-971i.onrender.com/api
```
* for Locat-host
```bash
VITE_API_URL=http://localhost:3000/api
```
## Run frontend:
```bash
npm run dev
```

## 📸 Screenshots

### Login
<p align="center">
  <img src="./screenshots/login.png" alt="Login" width="300"/>
</p>

### Register
<p align="center">
  <img src="./screenshots/register.png" alt="Login" width="300"/>
</p>

### Notes Dashboard
<p align="center">
  <img src="./screenshots/notes.png" alt="Login" width="300"/>
</p>

## 📌 Notes
* Password reset tokens are securely hashed
* Rate limiting is applied on authentication routes
* Centralized error handling implemented
* Production-ready authentication flow
* Make sure MongoDB is running or use MongoDB Atlas

## 👨‍💻 Author

### 
🧧 Nitin : nitin981275@gmail.com

🔖 GitHub: https://github.com/nitin01924
