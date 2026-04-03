# Notes Web App (MERN)

A full-stack Notes Web Application built using the MERN stack.

## Features

* JWT Authentication
* User-specific notes
* Create, Read, Update, Delete (CRUD)
* Protected routes
* Toast notifications for feedback

---

## Tech Stack

* Frontend: React (Vite)
* Backend: Node.js, Express
* Database: MongoDB

---

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/nitin01924/note-app.git
```

---

### 2. Setup Backend

```
cd backend
npm install
```

Create a `.env` file inside backend:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3. Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

## Notes

* Make sure MongoDB is running or use MongoDB Atlas
* Backend runs on port 3000
* Frontend runs on Vite default port

---

## Author

Nitin 
Gmail : nitin981275@gmail.com

