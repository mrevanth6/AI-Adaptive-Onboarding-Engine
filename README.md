# AI-Powered Adaptive Learning & Onboarding Platform

An AI-powered full-stack web application that analyzes resumes, identifies skill gaps, and generates personalized learning roadmaps to help users prepare for their target roles.

---

## Overview

Traditional onboarding and career development processes are often generic and inefficient. This platform provides personalized learning recommendations by analyzing a user's resume and comparing their existing skills with the requirements of a target role.

Using Google's Gemini API, the application performs skill-gap analysis and generates adaptive learning roadmaps tailored to individual users.

---

## Features

* Secure user authentication using JWT.
* Resume upload support for PDF and DOCX files.
* Automatic resume parsing and skill extraction.
* AI-powered skill-gap analysis.
* Competency mapping based on target roles.
* Personalized learning roadmap generation.
* Weekly learning modules and recommendations.
* Responsive user interface for desktop and mobile devices.
* Saved learning roadmaps for future reference.

---

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Multer

### AI Integration

* Google Gemini API

---

## Application Workflow

1. User registers or logs into the platform.
2. User uploads a resume in PDF or DOCX format.
3. Resume content is extracted and processed.
4. User specifies a target role or job description.
5. The application performs skill-gap analysis.
6. Missing skills and competencies are identified.
7. Gemini generates a personalized learning roadmap.
8. The roadmap is saved for future access.

---

## Key Functionalities

### Resume Parsing

Extracts text and relevant information from uploaded resumes.

### Skill Gap Analysis

Compares existing skills with target role requirements and identifies missing competencies.

### Competency Mapping

Categorizes user skills into proficient, partial, and missing areas.

### Personalized Roadmaps

Generates adaptive weekly learning plans with recommended topics and modules.

---

## Project Structure

```text
frontend/
│
├── src/
├── components/
├── pages/
└── assets/

backend/
│
├── routes/
├── controllers/
├── middleware/
├── services/
└── models/
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/AI-Adaptive-Onboarding-Engine.git
cd AI-Adaptive-Onboarding-Engine
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_SECRET_ID=your_google_secret_id
```

---

## Future Enhancements

* Learning progress tracking.
* Course recommendations.
* Roadmap completion analytics.
* Email notifications.
* AI interview preparation.
* Deployment and cloud hosting.

---

## Developed During

This project was developed during a hackathon to address challenges in traditional employee onboarding and personalized upskilling.

---

## Author

M. Revanth Kumar Reddy

Computer Science Engineering Student

GitHub: https://github.com/mrevanth6
