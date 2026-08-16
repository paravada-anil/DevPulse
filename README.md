# DevPulse 🚀

### Developer Learning Progress Dashboard

DevPulse is a full-stack developer learning dashboard designed to help developers track their learning progress, manage skills, and connect their GitHub profile.

## ✨ Features

* 🔐 User Signup & Login
* 🔒 JWT-based Authentication
* 👤 User Profile
* ✏️ Edit Profile Bio
* 💻 Add and Remove Skills
* 📊 Skill Progress Tracking
* 📈 Overall Learning Progress
* 🚀 Automatic Skill Level Display
* 🐙 GitHub Profile Integration
* 📦 GitHub Repository Information
* 🔗 Direct GitHub Profile Link
* 📱 Responsive Dashboard UI

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Node.js
* Express.js
* JWT
* bcrypt

### Database

* MongoDB Atlas
* Mongoose

### API

* GitHub REST API

## 📂 Project Structure

```text
DevPulse/
├── backend/
│   ├── models/
│   │   └── user.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── Dashboard.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
│
└── .gitignore
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/paravada-anil/DevPulse.git
cd DevPulse
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add your required environment variables.

Then start the backend:

```bash
node server.js
```

The backend runs on:

```text
https://devpulse-backend-oabh.onrender.com
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite development server.

## 🐙 GitHub Integration

DevPulse allows users to enter a GitHub username and retrieve public GitHub information such as:

* GitHub username
* Profile image
* Public repositories
* Followers
* Following
* GitHub profile link

## 📊 Learning Progress

Users can add skills and track their learning progress.

Each skill displays:

* Progress percentage
* Learning level
* Overall average progress

## 🔐 Security

DevPulse uses:

* JWT authentication
* Password hashing with bcrypt
* Environment variables for sensitive configuration
* `.gitignore` to prevent sensitive files and dependencies from being uploaded

> Never upload your `.env` file or secret keys to GitHub.

## 🎯 Project Goal

The goal of DevPulse is to provide a simple and useful platform where developers can manage their learning journey while viewing their GitHub activity in one dashboard.

## 👨‍💻 Author

**Anil**

GitHub: https://github.com/paravada-anil

## 📄 License

This project is created as a learning/development project.
