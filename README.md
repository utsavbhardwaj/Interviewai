<h1 align="center" id="title">Interview AI - Ace your interviews</h1>

<p align="center"><img src="https://socialify.git.ci/utsavbhardwaj/Interviewai/image?custom_language=JavaScript&amp;description=1&amp;font=JetBrains+Mono&amp;language=1&amp;name=1&amp;owner=1&amp;pattern=Charlie+Brown&amp;theme=Light" alt="project-image"></p>

Live Link - https://interviewai-v52b.onrender.com/

## 🏁 Overview
Avoid Hefty Mock interview practice switch to AI powered Interview prepration !

With Interview AI, all you need to do is sign up, upload your resume and job description, and you're ready to practice. You’ll face a real-world interview simulation where questions are tailored just for you, based on what you’ve shared.

After the session, you’ll get instant feedback on how you did — what went well, what can be improved, and tips to help you do better next time. It's like having a personal coach, available anytime you want to practice.

No more guesswork, just Leaser focused preparation that helps you get better with every attempt.

## 📸 Project Screenshots

<img width="1710" height="704" alt="homepg" src="https://github.com/user-attachments/assets/b287fc8d-a640-493e-8bce-5f2f803ccf21" />

## ✨ Features

### 🎙️ Realistic Interview Experience  
Get questions just like in a real interview. 

### 📄 Simple Resume Upload  

### 🧠 AI-Generated Questions Based on Your Resume & Job Role  

### 💬 Real Time Voice-to-Voice Interaction  

### 📊 Instant Feedback After the Interview  

### 🕹️ Easy to Use, Mobile-Friendly Interface  

## 🏗️ System Architecture

Here’s a quick look at how the app is built behind the scenes — everything is organized into frontend, backend, and storage to keep things clean and efficient:

---

### 🖥️ Frontend  
- Built with **React + TypeScript** using **Vite** for fast builds.  
- Uses **Shadcn/UI** for clean, accessible components.  
- Styled with **Tailwind CSS**, with a consistent custom design.  
- **Wouter** handles navigation between pages.  
- **TanStack Query** keeps all the server data in sync.  
- Built-in access to **camera, mic, and speech recognition** for interviews.

---

### 🧠 Backend  
- Runs on **Node.js** using **Express.js**.  
- Written in **TypeScript** using modern ES modules.  
- Talks to the database using **Drizzle ORM**.  
- Handles resume uploads using **Multer**.  
- Connects with **Gemini AI** to ask smart, personalized interview questions.

---

### 💾 Data & Storage  
- Uses **PostgreSQL** hosted on **Neon**.  
- All tables and relationships are managed with **Drizzle’s type-safe schema**.  
- **Session info** is saved in the database using `connect-pg-simple`.  
- Uploaded files like resumes and job descriptions are stored temporarily in memory.  
- A custom `DatabaseStorage` class handles saving and fetching interview data cleanly.

## Systen Architecture

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/2c32d248-d11a-413e-89f6-1b728f2cc478" />

## 🛠 Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (Neon or local)
- Google Gemini API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/InterviewAI.git
cd InterviewAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root directory

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=PLACEHOLDER
DB_SSL=false
DATABASE_URL=postgresql://neondb_YOUR URL 
VITE_CLERK_PUBLISHABLE_KEY=YOUR KEY

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

```

### Run the Application

```bash
npm run dev
```
### 🛡️ Security

- All sensitive user data like resumes and job descriptions are handled securely.
- Environment variables are used to keep API keys and database credentials private.
- Passwords and session data are never stored on the client side.
- Backend validations are implemented to prevent injection and malicious attacks.
- CORS policy is set to allow requests only from trusted origins.
- Uploaded files are validated and securely stored to avoid misuse.
- Sessions are managed using PostgreSQL with `connect-pg-simple` for persistence.
- HTTPS is strongly recommended in production to encrypt data in transit.

### 📈 Performance

- Frontend is built with Vite for faster development and optimized production builds.
- Code-splitting and lazy-loading improve initial load times.
- TanStack Query ensures efficient data fetching and caching.
- Server-side logic is optimized using asynchronous operations.
- PostgreSQL (via Neon) provides fast, scalable data access.
- Only necessary media streams (audio/video) are activated during interview.
- Minimal bundle size using tree-shaking and lightweight dependencies.
- Efficient state management avoids unnecessary re-renders.

### 🧪 Testing & Debugging

- Real-time console logs available on both frontend and backend for easy debugging.
- API responses are validated and structured clearly for easier testing.
- Errors and exceptions are gracefully handled with fallback UI and proper messages.
- Frontend components are debugged using React Developer Tools.
- Backend logs and responses can be tracked using Postman or Thunder Client.
- Environment-based logging ensures cleaner logs in production.
- Edge-case handling tested manually during AI-driven interview flows.

### Contact 📞
Email - utsavjha.me@gmail.com
