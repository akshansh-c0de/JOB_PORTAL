# JobPortal - Full Stack Job Search Platform

JobPortal is a modern, full-stack application designed to connect job seekers with employers. Built with the MERN stack (MongoDB, Express, React, Node.js), it provides a seamless experience for finding opportunities and managing applications with a clean, user-centric interface.

## 🚀 Features

### For Candidates
- **Browse Jobs**: Search and filter job opportunities in real-time.
- **Easy Application**: Apply to jobs with a single click after providing a resume link.
- **Secure Authentication**: JWT-based login and registration with hashed passwords.

### For Recruiters
- **Post Jobs**: Manage job listings with detailed descriptions and salary information.
- **Role-Based Access**: Specialized recruiter accounts with exclusive posting privileges.

### Core System
- **Advanced Searching**: Keyword-based and location-based job filtering.
- **Pagination**: Efficient data loading for large volumes of job listings.
- **Error Handling**: Global error middleware providing consistent API feedback.

## 🛠️ Tech Stack

**Frontend**
- React.js (Vite)
- Axios (with centralized Interceptors)
- React Router DOM
- Vanilla CSS (Glassmorphism & Responsive Design)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js (Password Security)

## 📁 Folder Structure

```text
job-portal/
├── config/             # Database connection setup
├── controllers/        # Request handling logic (MVC)
├── models/             # Mongoose schemas & data models
├── routes/             # API endpoint definitions
├── middlewares/        # Auth & Global error handlers
├── utils/              # Custom utilities (ErrorHandler)
├── frontend-react/     # React application (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   └── api.js      # Centralized Axios configuration
├── server.js           # Backend entry point
└── .env                # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create a new account.
- `POST /api/v1/auth/login` - Authenticate and receive JWT.

### Jobs
- `GET /api/v1/jobs` - List all jobs (supports `?keyword=` and `?location=`).
- `GET /api/v1/jobs/:id` - Get specific job details.
- `POST /api/v1/jobs` - Create a job (Recruiter Only).

### Applications
- `POST /api/v1/applications/apply/:jobId` - Apply for a job (Candidate Only).
- `GET /api/v1/applications/me` - View personal applications.

## ⚙️ How to Run Locally

### 1. Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### 2. Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Setup Backend
```bash
npm install
npm run dev
```

### 4. Setup Frontend
```bash
cd frontend-react
npm install
npm run dev
```

---
*Created as part of a placement preparation project focused on clean code and robust MVC architecture.*
