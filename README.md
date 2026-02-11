# cf_ai_interview_coach

An AI-powered technical interview coach built with Cloudflare Workers AI, React, and TypeScript. Practice mock technical interviews with an intelligent AI interviewer that remembers context and provides constructive feedback.

![Cloudflare Workers AI](https://img.shields.io/badge/Cloudflare-Workers%20AI-orange) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Real-time AI Conversations**: Powered by Llama 3.3 (70B) on Cloudflare Workers AI
- **Context-Aware**: Remembers conversation history throughout the session
- **Personalized Feedback**: Adapts questions based on role and experience level
- **Modern UI**: Glassmorphic design with smooth animations
- **Serverless Architecture**: Fully deployed on Cloudflare Workers and Pages

## Architecture

### Backend (Cloudflare Worker)
- **Runtime**: Cloudflare Workers (serverless)
- **AI Model**: Llama 3.3 70B Instruct via Workers AI binding
- **State Management**: Cloudflare KV for conversation history (24h TTL)
- **Language**: TypeScript
- **CORS**: Enabled for cross-origin requests

### Frontend (React SPA)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (ultra-fast HMR)
- **Styling**: Tailwind CSS with custom glassmorphism
- **Deployment**: Cloudflare Pages
- **Animations**: Custom CSS animations and Tailwind utilities

## Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier supported)
- Wrangler CLI: `npm install -g wrangler`

## Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/ibiraza1077-pixel/cf_ai_interview_coach.git
cd cf_ai_interview_coach
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Create KV namespaces
wrangler kv namespace create "CONVERSATIONS"
wrangler kv namespace create "CONVERSATIONS" --preview

# Update wrangler.toml with the KV namespace IDs from output above

# Start backend development server
npm run dev
```

Backend runs at `http://localhost:8787`

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8787" > .env

# Start frontend development server
npm run dev
```

Frontend runs at `http://localhost:5173`

## Production Deployment

### Deploy Backend Worker
```bash
# From project root
npm run deploy
```

Copy the Worker URL from deployment output (e.g., `https://cf-ai-interview-coach.your-subdomain.workers.dev`)

### Deploy Frontend to Pages
```bash
cd frontend

# Update environment with production Worker URL
echo "VITE_API_URL=https://your-worker-url.workers.dev" > .env

# Build and deploy
npm run build
wrangler pages deploy dist --project-name=cf-ai-interview-coach
```

## Project Structure
```
cf_ai_interview_coach/
├── src/
│   └── index.ts              # Worker backend with AI integration
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main React component
│   │   ├── main.tsx          # React entry point
│   │   └── index.css         # Tailwind + custom styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── wrangler.toml             # Worker configuration
├── package.json
├── tsconfig.json
├── README.md
└── PROMPTS.md                # AI prompts documentation
```

## API Documentation

### POST /api/chat
Send a message to the AI interviewer.

**Request:**
```json
{
  "message": "I'm preparing for a full-stack role",
  "sessionId": "session_123456"
}
```

**Response:**
```json
{
  "response": "Great! Let's start with...",
  "sessionId": "session_123456"
}
```

### POST /api/reset
Reset the conversation history.

**Request:**
```json
{
  "sessionId": "session_123456"
}
```

**Response:**
```json
{
  "success": true
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Technology Stack

- **Cloudflare Workers AI**: LLM inference at the edge with Llama 3.3
- **Cloudflare Workers**: Serverless compute platform
- **Cloudflare KV**: Distributed key-value storage
- **Cloudflare Pages**: JAMstack deployment platform
- **React 18**: Modern frontend framework
- **TypeScript**: Type-safe development
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework

## Assignment Requirements

This project fulfills all optional assignment requirements:

- **LLM Integration**: Llama 3.3 70B Instruct on Workers AI  
- **Workflow/Coordination**: Cloudflare Workers with KV state management  
- **User Input**: Chat interface via Cloudflare Pages  
- **Memory/State**: Conversation history stored in KV with 24h TTL  
- **Repository Naming**: Prefixed with `cf_ai_`  
- **Documentation**: Complete README with running instructions  
- **Prompts Documentation**: All AI prompts documented in PROMPTS.md  

## Design Implementation

- **Glassmorphism**: Modern frosted glass effects throughout UI
- **Gradient Backgrounds**: Animated color transitions for visual appeal
- **Smooth Animations**: Fade-in, slide-up, and pulse effects on interactions
- **Responsive Design**: Optimized for desktop and mobile viewports
- **Custom Scrollbar**: Themed styling consistent with overall design
- **Loading States**: Professional typing indicators during AI processing
- **Message Bubbles**: Distinct visual styling for user and AI messages

## License

MIT

## Author

**Ibrahim**  
GitHub: [@ibiraza1077-pixel](https://github.com/ibiraza1077-pixel)  
Ulster University - Computer Science Student  
Specializing in full-stack development with modern web technologies
