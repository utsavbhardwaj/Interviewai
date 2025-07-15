# AI Interview Master - Replit Documentation

## Overview

AI Interview Master is a full-stack web application that provides AI-powered mock interview practice. The system allows users to upload their resume and job descriptions, generates tailored interview questions using Google's Gemini AI, conducts real-time video interviews with speech recognition, and provides detailed feedback and performance analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and data layers:

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Media Handling**: Web APIs for camera/microphone access and speech recognition

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **File Upload**: Multer for handling multipart form data
- **AI Integration**: Google Gemini AI for question generation and response analysis

### Data Storage
- **Database**: PostgreSQL via Neon serverless (ACTIVE - migrated from in-memory storage 2025-07-15)
- **Schema**: Type-safe schema definitions with Drizzle ORM with relations
- **Session Storage**: Connect-pg-simple for PostgreSQL session storage
- **File Storage**: In-memory storage for uploaded files (resume, job descriptions)
- **Data Layer**: DatabaseStorage class implementing IStorage interface for persistent data

## Key Components

### Database Schema
The application uses two main tables:
- **Users**: Basic user information (username, email, password)
- **Interviews**: Complete interview data including questions, responses, feedback, and metadata
- JSON fields store complex data like questions array, responses with timestamps, and detailed feedback analysis

### API Endpoints
- `GET /api/interviews` - Retrieve all interviews for demo user
- `GET /api/interviews/:id` - Get specific interview details
- `POST /api/interviews` - Create new interview with file uploads
- `PUT /api/interviews/:id` - Update interview (responses, completion status)
- `POST /api/interviews/:id/feedback` - Generate AI feedback analysis

### AI Integration
- **Question Generation**: Analyzes job description and resume to create relevant interview questions
- **Response Analysis**: Evaluates user answers for technical knowledge, communication, problem-solving, and cultural fit
- **Feedback Generation**: Provides detailed scoring and improvement recommendations

### Real-time Features
- **Video Interface**: WebRTC camera/microphone access
- **Speech Recognition**: Browser-based speech-to-text for hands-free answering
- **Live Transcription**: Real-time capture of user responses

## Data Flow

1. **Interview Setup**: User uploads resume and job description files
2. **AI Processing**: Gemini AI generates tailored interview questions based on uploaded content
3. **Interview Session**: Real-time video interface with speech recognition captures user responses
4. **Response Analysis**: Each answer is analyzed by AI for multiple criteria
5. **Feedback Generation**: Comprehensive feedback with scores, strengths, and improvement areas
6. **Dashboard Analytics**: Performance tracking and historical interview data

## External Dependencies

### Core Dependencies
- **@google/genai**: Google Gemini AI integration for question generation and analysis
- **@neondatabase/serverless**: Neon PostgreSQL serverless database client
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **multer**: File upload handling

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **API Server**: Express server with automatic restarts
- **Database**: Neon PostgreSQL with connection pooling
- **Build Process**: Separate client and server build steps

### Production Build
- **Client**: Vite builds optimized React application to `dist/public`
- **Server**: ESBuild bundles Node.js server to `dist/index.js`
- **Assets**: Static files served from build directory
- **Environment**: Production environment variables for database and AI API keys

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations with `npm run db:push`
- **Connection**: Environment-based database URL configuration via Neon serverless
- **Schema**: Shared schema definitions between client and server with user-interview relations
- **Session Storage**: PostgreSQL-backed session management for user authentication
- **Demo Data**: Automatic demo user creation (username: "demo") for immediate testing

## Recent Changes (2025-07-15)

✓ Fixed critical speech recognition grammar errors that were preventing voice responses
✓ Implemented automatic live conversation flow - AI speaks question → auto-listens → processes response
✓ Removed manual recording buttons for seamless live interview experience
✓ Added automatic response submission after 3 seconds of silence
✓ Fixed PostgreSQL UTF-8 encoding errors with base64 file conversion
✓ Moved interview creation from home page to dashboard for better UX flow

**Live Conversation Features:**
- AI automatically asks questions and waits for voice responses
- Speech recognition starts automatically after AI finishes speaking
- User responses are automatically submitted after brief silence
- Real-time visual feedback shows listening/speaking status
- Manual override button available for immediate submission

The application is designed for easy deployment on platforms like Replit, with automatic environment detection and development tooling integration.