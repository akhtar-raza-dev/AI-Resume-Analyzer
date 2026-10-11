# SmartHire — AI Resume Analyzer

SmartHire is an AI-powered resume screening application that compares a PDF resume with a job description and generates a match score with written feedback. Users sign in with Google, upload resumes, review AI analysis results, and access their previous analyses.

**Live application:** [https://ai-resume-analyzer-z437.onrender.com](https://ai-resume-analyzer-z437.onrender.com)

## Overview

SmartHire provides:

- Google authentication through Firebase
- PDF resume upload and text extraction
- AI-powered resume analysis through Cohere
- Match score generation from 0–100
- Written strengths, weaknesses, and improvement feedback
- MongoDB storage for users and analysis history
- User history and administrator resume views
- Single-service deployment where Express serves the built React application

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Material UI and Emotion
- Tailwind CSS
- React Markdown

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Multer for PDF uploads
- `pdf-parse` for extracting resume text
- Cohere AI for resume analysis

### Authentication and deployment

- Firebase Authentication with Google sign-in
- Render Web Service
- MongoDB Atlas

## Project Structure

```text
AI-Resume-Analyzer/
├── backend_ai/
│   ├── Controllers/          # User and resume request handlers
│   ├── Models/               # Mongoose user and resume schemas
│   ├── Routes/               # Express API routes
│   ├── utils/                # Upload configuration
│   ├── build/                # Production React build served by Express
│   ├── uploads/              # Runtime PDF upload directory
│   ├── conn.js               # MongoDB connection
│   ├── index.js              # Express application entry point
│   ├── package.json
│   └── .env                  # Local secrets; never commit
├── mern_ai/
│   ├── src/
│   │   ├── component/        # Login, dashboard, history, admin, and sidebar UI
│   │   ├── utils/            # Firebase, Axios, and authentication context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Features

### Google sign-in

Users authenticate with Google through Firebase Authentication. After sign-in, the application registers or retrieves the user in MongoDB.

### Resume analysis

1. Select a PDF resume.
2. Paste a job description.
3. Click **Analyze Resume**.
4. The backend extracts the resume text.
5. Cohere evaluates the resume against the job description.
6. The score and feedback are saved to MongoDB and shown in the dashboard.

### History and administration

- Users can view their previous resume analyses.
- Administrators can view stored analyses through the admin page.
- Saved analyses can be deleted through the backend API.

## Prerequisites

Before running SmartHire locally, install:

- Node.js 20 or newer
- npm
- A MongoDB Atlas cluster
- A Cohere account and API key
- A Firebase project with Google sign-in enabled

## Environment Variables

### Backend: `backend_ai/.env`

Create a `.env` file inside `backend_ai`:

```env
COHERE_API_KEY=your_cohere_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_ai
```

Never commit this file or expose its values in screenshots, logs, or public repositories.

### Frontend: Firebase configuration

Firebase web configuration is read by:

```text
mern_ai/src/utils/firebase.jsx
```

Use the configuration from your own Firebase web application:

```js
const firebaseConfig = {
  apiKey: "your_firebase_api_key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project_id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id",
  measurementId: "your_measurement_id"
};
```

Enable **Google** under **Firebase Console → Authentication → Sign-in method**. After deployment, add the Render hostname under **Authentication → Settings → Authorized domains**.

## Local Installation

Install backend dependencies:

```bash
cd backend_ai
npm install
```

Install frontend dependencies:

```bash
cd ../mern_ai
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` option may be needed because the current ESLint plugin versions have a peer-dependency mismatch.

## Running Locally

### Start the backend

From `backend_ai`:

```bash
npm start
```

The API runs on:

```text
http://localhost:4000
```

### Start the frontend

Open another terminal:

```bash
cd mern_ai
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

### Build the frontend for the backend

For the single-service deployment model:

```bash
cd mern_ai
npm run build
```

Copy the generated `mern_ai/dist` contents into `backend_ai/build` so Express can serve the latest frontend build.

## API Routes

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/user` | Register or retrieve a user |
| `POST` | `/api/resume/addResume` | Upload and analyze a resume |
| `GET` | `/api/resume/get/:user` | Get analyses for one user |
| `GET` | `/api/resume/get` | Get all analyses for administration |
| `DELETE` | `/api/resume/delete/:id` | Delete an analysis |

The resume upload endpoint expects a multipart form with:

- `resume`: PDF file
- `job_desc`: job description text
- `user`: MongoDB user ID

## Render Deployment

This repository is configured for one Render Web Service. The service should use `backend_ai` as its root directory because that folder contains the Express server and the production frontend build.

### Render settings

```text
Service type: Web Service
Root Directory: backend_ai
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Add these environment variables in Render:

```text
COHERE_API_KEY=your_cohere_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_ai
```

The backend uses Render's dynamic `PORT` value and falls back to port `4000` locally. On a successful deployment, the logs should include:

```text
backend is running on port ...
Database Connected Successfully
```

The deployed application is available at:

[https://ai-resume-analyzer-z437.onrender.com](https://ai-resume-analyzer-z437.onrender.com)

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user under **Database Access**.
3. Add the required IP addresses under **Network Access**.
4. Copy the Node.js driver connection string.
5. Replace the username and password placeholders.
6. Store the final URI only in local or Render environment variables.

If the database password contains special URL characters, URL-encode it before placing it in `MONGODB_URI`.

## Security Notes

- Never commit `.env` files.
- Do not place Cohere or MongoDB credentials in frontend code.
- Rotate any key or password that has been exposed.
- Use a separate database user for production.
- Review MongoDB Atlas network access before production use.
- Uploaded files are stored on the server filesystem and should be treated as temporary runtime files.

## License

This project is provided for personal, educational, and portfolio use. Add the license terms appropriate for your intended distribution before publishing it as an open-source project.

## Contact

For project questions or deployment support, open an issue in the GitHub repository.
