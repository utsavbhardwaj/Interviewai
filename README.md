# 🎙️ Interview AI — Ace Your Interviews

Avoid hefty mock interview fees! Walk into your next interview with absolute confidence using **Interview AI**, a high-fidelity, interactive mock interview simulation platform. Powered by Google Gemini (with DeepSeek backup), it parses your resume and job description to simulate a live, voice-to-voice interview, delivering real-time responses and structured feedback.

---

## 🚀 Live Demo

Check out the live deployment here:  
👉 **[Interview AI - Live Demo](https://interviewai-v52b.onrender.com/)**

### Application Preview
![Interview AI Home Page](https://github.com/user-attachments/assets/b287fc8d-a640-493e-8bce-5f2f803ccf21)

---

## ✨ Features

- **Tailored AI Question Generation**: Dynamically extracts plain text from PDF/Word resumes and Job Descriptions to generate 10 progressive questions customized for your experience and the target role.
- **Flexible Job Description Input**: Paste job description text directly into the dashboard or upload a file.
- **Seamless Speech Recognition & Voice Interaction**: Integrates camera and microphone access paired with a polished speech-to-text interface to record responses hands-free.
- **No-Loop Mic Separation**: Implements a 1-second delay and audio filtering after AI speech synthesis to prevent the microphone from picking up the system's own spoken questions.
- **Snappy Conversational Responses**: Instant conversational AI acknowledgments (under 30 words) between questions to mimic a natural human dialogue.
- **Comprehensive Feedback Dashboard**: Provides a detailed post-interview scorecard grading candidates on *Technical Knowledge*, *Communication*, *Problem Solving*, and *Cultural Fit*. Includes a question-by-question breakdown, strengths, areas of improvement, and custom recommendations.
- **Intelligent Cache & Storage Layer**: Redis caches AI questions (24h TTL) and feedback (2h TTL) to minimize latency and API costs. AWS S3 handles file storage. Both systems feature robust local fallbacks (in-memory maps and disk storage) for effortless zero-config local development.
- **Premium Glassmorphic UI**: Beautiful, interactive UI featuring custom radial ambient background glows, floating Framer Motion cards, sparkles badges, and responsive widgets.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React v18 + TypeScript + Vite v5
- **Styling**: Tailwind CSS v3 + Framer Motion (micro-animations) + Shadcn/ui (Radix UI primitives)
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query v5 (React Query)
- **Authentication**: Clerk (`@clerk/clerk-react`)
- **Speech Capture**: Browser-based speech recognition API via `react-speech-recognition`

### Backend
- **Framework**: Node.js + Express.js + ESBuild (ESM production bundler with code-splitting)
- **ORM**: Drizzle ORM + Drizzle Kit (schema migrations)
- **Database**: PostgreSQL (Neon serverless or local instance) + `connect-pg-simple` (session stores)
- **AI Integrations**: Google Gemini API (`@google/genai` using `gemini-2.5-flash`) + DeepSeek API (`deepseek-chat` as dynamic fallback)
- **Caching**: Redis (via `ioredis`) with custom TTL
- **Storage**: AWS S3 (`@aws-sdk/client-s3`)
- **Document Parsing**: `pdf-parse` & `mammoth` (Word document extractor)

---

## 🏗️ Architecture

The application follows a decoupled client-server architecture built for speed, scalability, and seamless user experience:

1. **Client (React SPA)**: Captures user documents, coordinates speech-to-text, and renders a glassmorphic simulator and feedback reports.
2. **Server (Express API)**: Handles document uploading, parses text binaries, calls AI APIs, and coordinates database reads/writes.
3. **Data Layer**: PostgreSQL handles persistent models (Users & Interviews). Redis caches response vectors to prevent redundant API queries. AWS S3 stores physical files.

### System Architecture Diagram
![System Architecture](https://github.com/user-attachments/assets/2c32d248-d11a-413e-89f6-1b728f2cc478)

---

## 📂 Project Structure

```
├── client/                     # React Frontend Single Page Application
│   ├── src/
│   │   ├── components/         # Reusable layouts and feature-specific widgets
│   │   │   ├── feedback/       # Feedback charts and analytics panels
│   │   │   ├── interview/      # Video widgets and speech visualizers
│   │   │   ├── layout/         # Header and Sidebar structures
│   │   │   └── ui/             # Shadcn primitives (Dialog, Button, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # API client and query setups
│   │   └── pages/              # Main view entrypoints
│   │       ├── dashboard.tsx   # Session launcher & performance history
│   │       ├── feedback.tsx    # Post-interview AI scorecard
│   │       ├── home.tsx        # High-fidelity landing page & simulator
│   │       ├── interview.tsx   # Live video/speech interview room
│   │       ├── sign-in.tsx     # Authentication sign-in
│   │       └── sign-up.tsx     # Authentication registration
│   └── index.html              # HTML shell template
├── server/                     # Express Backend API
│   ├── services/               # Integrations & utilities
│   │   ├── deepseek.ts         # Backup question-generation module
│   │   ├── document-parser.ts  # Mammoth and pdf-parse file adapters
│   │   ├── gemini.ts           # Core Google Gemini AI orchestration
│   │   ├── redis.ts            # Redis setup and key/value cache fallbacks
│   │   └── s3.ts               # AWS S3 client and local upload fallbacks
│   ├── db.ts                   # Drizzle client configuration
│   ├── routes.ts               # REST API routing endpoints
│   ├── static.ts               # Production static file serving configurations
│   ├── storage.ts              # Data abstraction layer mapping queries
│   └── index.ts                # Server entrypoint with dev-isolation logic
├── shared/                     # Cross-project TypeScript interfaces & validation
│   └── schema.ts               # Drizzle pgTables and Zod validation schemas
├── Dockerfile                  # Multi-stage production container setup
├── docker-compose.yml          # Container configuration for local deployment
├── drizzle.config.ts           # Drizzle schema path configurations
└── vite.config.ts              # Vite asset bundle configurations
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory. Copy and adjust the following configurations:

```env
# Database Credentials
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=interviewaidb
DB_SSL=false
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Clerk Authentication (Client-side & Server URL fallbacks)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_yourclerkkey
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# AI Keys
GEMINI_API_KEY=your_gemini_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key # Optional: Backup AI model key

# Redis Caching (Optional: falls back to in-memory Map)
REDIS_URL=redis://localhost:6379

# AWS S3 File Storage (Optional: falls back to local disk storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket_name
```

---

## 🛠️ Installation

Follow these steps to set up the project locally:

### Prerequisites
- **Node.js**: `v18.19.0` or higher
- **PostgreSQL**: Local instance or a cloud cluster (e.g., Neon)
- **Google Gemini API Key**: Acquired via Google AI Studio

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/utsavbhardwaj/Interviewai.git
   cd Interviewai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file at the root of the project and populate it with your credentials (see [Environment Variables](#environment-variables)).

4. **Synchronize Database Schema**:
   Push the Drizzle models into your database:
   ```bash
   npm run db:push
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5008` (or the port specified by your terminal output).

---

## 💡 Usage

1. **Create an Account**: Register or log in via the integrated Clerk dashboard.
2. **Launch a Session**: On your dashboard, input your target Job Title and Company. Upload your resume (PDF/Word), and either upload the Job Description file or paste the JD text.
3. **Conduct the Interview**:
   - Grant the browser microphone and camera access.
   - The AI interviewer will state the question verbally.
   - Click the microphone toggle to speak your answer. Your live spoken response will transcribe on-screen.
   - When you finish speaking, the system will process your answer, respond with a short conversational acknowledgment, and automatically advance to the next question.
4. **Analyze Your Feedback**: Once all 10 questions are completed, view the interactive feedback report detailing your overall scorecard, strength graphs, and question-by-question improvement critiques.

---

## 🔌 API Documentation

### Interviews API (`server/routes.ts`)

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/interviews` | Retrieves all historical interviews for the user. | *None* |
| **GET** | `/api/interviews/:id` | Retrieves a specific interview session. | `:id` (Interview ID) |
| **POST** | `/api/interviews` | Creates a new session, uploads documents, parses text, and generates 10 AI questions. | Multipart-form: `resume` (file), `jobDescription` (file/optional), `jobTitle` (text), `company` (text), `jobDescriptionText` (text/optional) |
| **POST** | `/api/interviews/:id/start` | Updates interview status to `in_progress` and generates questions if not pre-generated. | `:id` (Interview ID) |
| **POST** | `/api/interviews/:id/response` | Submits candidate answer to a question and returns a short conversational response. | `:id`, Body: `{ question: string, answer: string }` |
| **POST** | `/api/interviews/:id/complete` | Finalizes the interview, marks status as `completed`, and triggers AI feedback synthesis. | `:id`, Body: `{ duration: number }` |
| **DELETE** | `/api/interviews/:id` | Deletes the interview session from history. | `:id` (Interview ID) |

---

## 🗄️ Database Schema

Managed through Drizzle ORM in `shared/schema.ts`, the database utilizes two core tables linked via relationships:

### Users Table (`users`)
Stores profile authentication metadata.
- `id` (serial, primary key)
- `username` (text, unique, not null)
- `email` (text, unique, not null)
- `password` (text, not null)
- `createdAt` (timestamp, default now)

### Interviews Table (`interviews`)
Tracks session files, inputs, progressive questions, responses, and feedback summaries.
- `id` (serial, primary key)
- `userId` (integer, references `users.id`)
- `jobTitle` (text, not null)
- `company` (text)
- `jobDescription` (text, stores base64 version of original uploaded document)
- `resume` (text, stores base64 version of original uploaded document)
- `resumeUrl` (text, AWS S3 URL or local path)
- `jobDescriptionUrl` (text, AWS S3 URL or local path)
- `resumeText` (text, parsed plain text content)
- `jobDescriptionText` (text, parsed plain text content)
- `status` (text, default `'pending'`) — states: `pending`, `in_progress`, `completed`
- `questions` (jsonb, array of generated strings)
- `responses` (jsonb, array of `{ question: string; answer: string; timestamp: number }`)
- `feedback` (jsonb, structure containing scores, strengths, improvements, recommendations, and question analyses)
- `duration` (integer, duration in minutes)
- `createdAt` (timestamp, default now)
- `completedAt` (timestamp)

---

## 🔄 Workflow

```mermaid
graph TD
    A[Upload Resume & JD] --> B[Parse PDF/Word Binary into Plain Text]
    B --> C{Check Redis cache for Questions}
    C -- Hit --> D[Retrieve Cached Questions]
    C -- Miss --> E[Call Gemini/DeepSeek to Generate Questions]
    E --> F[Cache Questions in Redis]
    F --> G[Start Interview Simulation]
    D --> G
    G --> H[Speech Synthesis Speaks Question]
    H --> I[Mic Captures Spoken Answer & Transcribes]
    I --> J[Submit Answer to /response Endpoint]
    J --> K[AI Speaks Conversational Acknowledgment]
    K --> L{Is Last Question?}
    L -- No --> H
    L -- Yes --> M[Trigger /complete & Analyze Feedback]
    M --> N{Check Redis cache for Feedback}
    N -- Hit --> O[Render Detailed Analytical Scorecard]
    N -- Miss --> P[Gemini Synthesizes Scorecard JSON]
    P --> Q[Cache Feedback in Redis]
    Q --> O
```

---

## ⚠️ Challenges Faced

During the implementation and refactoring of this application, several design and architectural challenges were successfully resolved:

1. **PDF and Word Document Text Corruption**:
   - *Problem*: Early versions read document buffers directly as plain text strings, corrupting the binary formatting and generating gibberish prompts for Gemini (causing API failure fallbacks).
   - *Solution*: Integrated specialized parsers `pdf-parse` and `mammoth` inside a dedicated `document-parser.ts` service to extract clean, plain text.

2. **Speech Recognition Loopback (AI Speaking to Mic)**:
   - *Problem*: The microphone would pick up the browser's own text-to-speech synthesis playing the question, feeding it into the candidate's transcript.
   - *Solution*: Configured robust hooks using the `react-speech-recognition` library. Applied a strict 1-second delay after speech synthesis completes before starting the microphone capture, paired with conversational processing states.

3. **Gemini API Pro Quota Limitations**:
   - *Problem*: Creating highly structured, nested JSON feedback packages using `gemini-2.5-pro` frequently hit free tier quotas, returning `429 Resource Exhausted` errors.
   - *Solution*: Replaced the feedback engine model with `gemini-2.5-flash`, which supports the exact same nested JSON schemas but processes requests significantly faster, stays well within free tier quotas, and reduces costs.

4. **Production Bundler ESM Resolution Issues**:
   - *Problem*: Building single files directly via `esbuild server/*.ts` threw runtime errors because relative imports lacked ESM `.js` suffixes. Additionally, development dependencies like `vite` were leaked into production bundles.
   - *Solution*: Decoupled production routing and assets by creating a clean `static.ts` for serving static assets. Configured ESBuild to run with `--bundle --splitting` using path aliases, ensuring code-splitting chunks isolated dev-only Vite packages so they are never loaded in production.

5. **Clerk Publishable Key Docker Build Baking**:
   - *Problem*: Clerk requires `VITE_CLERK_PUBLISHABLE_KEY` to be compiled directly into the frontend assets, but using Docker runtime env variables left this undefined at compile time.
   - *Solution*: Added `ARG` and `ENV` parameters to the `Dockerfile` build stage and linked them to `docker-compose.yml` build args to bake variables correctly during the Docker image creation process.

---

## 📜 Available Scripts

In the project root, you can execute:

* `npm run dev`: Starts both frontend (Vite) and backend (Express) in watch mode with live reloading.
* `npm run build`: Compiles client-side React assets to `dist/public` and bundles backend Server assets to `dist/index.js` using ESBuild.
* `npm run start`: Runs the compiled server bundle in production mode.
* `npm run check`: Performs static type checking across the TypeScript source files.
* `npm run db:push`: Applies database schema changes and synchronizes tables with PostgreSQL.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🗺️ Roadmap

- [ ] **Multiplayer & Peer Mock Sessions**: Practice interviews with peers side-by-side with real-time AI moderation.
- [ ] **Adaptive Difficulty Levels**: Dynamically adjust interview question difficulty based on the quality of preceding answers.
- [ ] **Persona Selection**: Select custom interviewer styles (e.g., "The Friendly Coach", "The Strict Technical Lead", "The Pragmatic Architect").
- [ ] **Resume Review Mode**: Standalone module reviewing resumes against job descriptions to suggest structural and content optimizations.
- [ ] **Calendar Integration**: Auto-schedule recurring mock practices directly into Google Calendar.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
