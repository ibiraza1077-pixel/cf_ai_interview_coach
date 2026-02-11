# Cloudflare AI Assignment Submission

## Project Information

**Project Name:** AI Interview Coach  
**Student:** Ibrahim  
**University:** Ulster University - Computer Science  
**GitHub Username:** ibiraza1077-pixel

## Live Deployment URLs

### Frontend (Cloudflare Pages)
**URL:** https://4f824ae0.cf-ai-interview-coach.pages.dev

### Backend (Cloudflare Worker)
**URL:** https://cf-ai-interview-coach.ai-interview-coach.workers.dev

### GitHub Repository
**URL:** https://github.com/ibiraza1077-pixel/cf_ai_interview_coach

## Assignment Requirements Checklist

✅ **Repository Naming:** Prefixed with `cf_ai_`  
✅ **README.md:** Complete documentation with running instructions  
✅ **PROMPTS.md:** All AI prompts documented  
✅ **LLM Integration:** Llama 3.3 70B Instruct on Cloudflare Workers AI  
✅ **Workflow/Coordination:** Cloudflare Workers with KV state management  
✅ **User Input:** Chat interface via Cloudflare Pages (React + TypeScript)  
✅ **Memory/State:** Conversation history in KV with 24-hour TTL  
✅ **Original Work:** All code written specifically for this assignment  

## Technical Architecture

### Backend Stack
- **Platform:** Cloudflare Workers (Serverless)
- **AI Model:** Llama 3.3 70B Instruct FP8 Fast
- **Database:** Cloudflare KV (Key-Value Store)
- **Language:** TypeScript
- **Features:** CORS enabled, session management, conversation history

### Frontend Stack
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom glassmorphism
- **Deployment:** Cloudflare Pages
- **Features:** Real-time chat, smooth animations, responsive design

## Key Features

1. **AI-Powered Interview Practice**
   - Realistic mock technical interviews
   - Personalized question difficulty
   - Constructive feedback after each response

2. **Context-Aware Conversations**
   - Maintains conversation history via KV storage
   - Sliding window of last 20 messages
   - Session isolation for privacy

3. **Modern UI/UX**
   - Glassmorphic design with gradient backgrounds
   - Smooth animations and transitions
   - Mobile-responsive layout
   - Professional color scheme

4. **Production-Ready**
   - Fully deployed on Cloudflare's edge network
   - Fast global response times
   - Automatic HTTPS
   - Zero server maintenance

## API Endpoints

### Health Check
```
GET /health
Response: {"status": "ok"}
```

### Chat Interface
```
POST /api/chat
Request: {
  "message": "Your message",
  "sessionId": "session_123"
}
Response: {
  "response": "AI response",
  "sessionId": "session_123"
}
```

### Reset Conversation
```
POST /api/reset
Request: {"sessionId": "session_123"}
Response: {"success": true}
```

## Testing Instructions

1. Visit the live frontend URL
2. The AI will greet you and ask about your background
3. Type a response (e.g., "I'm a full-stack developer preparing for FAANG interviews")
4. Continue the conversation to experience the mock interview
5. Click "New Interview" button to reset and start fresh

## Local Development Setup

See README.md for complete local development instructions including:
- Wrangler CLI installation
- KV namespace creation
- Environment configuration
- Running frontend and backend locally

## Project Highlights

- **Fast Development:** Completed in single session
- **Production Quality:** Professional UI and robust backend
- **Best Practices:** TypeScript, proper error handling, clean code structure
- **Documentation:** Comprehensive README and PROMPTS documentation
- **Scalable:** Edge-deployed, globally distributed architecture

## Contact

**GitHub:** https://github.com/ibiraza1077-pixel  
**Repository:** https://github.com/ibiraza1077-pixel/cf_ai_interview_coach

---

**Submission Date:** February 11, 2026  
**Assignment:** Cloudflare AI Optional Assignment
