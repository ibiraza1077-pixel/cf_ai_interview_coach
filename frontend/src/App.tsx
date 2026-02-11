import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = () => {
    setShowChat(true);
    setMessages([{
      role: 'assistant',
      content: 'Hello! I\'m your AI Technical Interview Coach. I\'m here to help you practice for software engineering interviews.\n\nCould you start by telling me a bit about yourself and what type of role you\'re preparing for (frontend, backend, full-stack, etc.)?',
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const resetConversation = async () => {
    try {
      await fetch(`${API_URL}/api/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      setSessionId(newSessionId);

      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m your AI Technical Interview Coach. I\'m here to help you practice for software engineering interviews.\n\nCould you start by telling me a bit about yourself and what type of role you\'re preparing for (frontend, backend, full-stack, etc.)?',
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Error resetting conversation:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Space Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
        
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {!showChat ? (
        // Hero Section
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">InterviewAI</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-6xl mx-auto text-center space-y-8 mt-20">
            {/* 3D Robot Illustration Area */}
            <div className="relative w-full h-64 mb-8 flex items-center justify-center">
              <div className="relative">
                {/* Glowing circle behind robot */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse-slow" style={{ width: '300px', height: '300px', margin: 'auto' }} />
                
                {/* Robot Icon (simplified representation) */}
                <div className="relative z-10">
                  <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" fill="none">
                    {/* Robot Head */}
                    <circle cx="100" cy="80" r="40" fill="url(#robotGradient)" className="drop-shadow-2xl" />
                    <circle cx="90" cy="75" r="6" fill="#60A5FA" className="animate-pulse" />
                    <circle cx="110" cy="75" r="6" fill="#60A5FA" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <path d="M 85 90 Q 100 95 115 90" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" fill="none" />
                    
                    {/* Robot Antenna */}
                    <line x1="100" y1="40" x2="100" y2="25" stroke="url(#antennaGradient)" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="22" r="4" fill="#60A5FA" className="animate-pulse" />
                    
                    {/* Robot Body */}
                    <rect x="70" y="120" width="60" height="50" rx="10" fill="url(#bodyGradient)" className="drop-shadow-xl" />
                    <circle cx="85" cy="140" r="4" fill="#60A5FA" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                    <circle cx="115" cy="140" r="4" fill="#60A5FA" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                      <linearGradient id="antennaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Nail Every Interview Question.
                </span>
                <br />
                <span className="text-white">
                  Land Every Job Offer.
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                AI-powered platform streamlines your interview preparation with realistic mock interviews, 
                personalized feedback, and adaptive question difficulty.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={startInterview}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Start Practice Interview</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity" />
              </button>
              
              <button
                onClick={startInterview}
                className="px-8 py-4 glass text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">10K+</div>
                <div className="text-sm text-gray-400 mt-2">Practice Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">95%</div>
                <div className="text-sm text-gray-400 mt-2">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-gray-400 mt-2">AI Availability</div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      ) : (
        // Chat Interface
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Chat Header */}
          <header className="glass-dark border-b border-white/10 backdrop-blur-xl">
            <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">AI Interview Coach</h1>
                    <p className="text-sm text-gray-400">Powered by Llama 3.3</p>
                  </div>
                </div>
                <button
                  onClick={resetConversation}
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    New Interview
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Messages */}
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}>
                      {message.role === 'user' ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block rounded-2xl px-5 py-3 shadow-xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                            : 'glass-dark text-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <p className="text-xs mt-1.5 text-gray-500 px-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="glass-dark rounded-2xl px-5 py-3 shadow-xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Input Form */}
          <div className="glass-dark border-t border-white/10 backdrop-blur-xl">
            <form onSubmit={sendMessage} className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Thinking
                      </>
                    ) : (
                      <>
                        Send
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      {!showChat && (
        <footer className="relative z-10 glass-dark border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 space-y-2 sm:space-y-0">
              <p className="flex items-center">
                Built with
                <span className="mx-1.5 text-blue-400">⚡</span>
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">Cloudflare Workers AI</span>
              </p>
              <p>
                Powered by <span className="font-semibold text-purple-400">Llama 3.3</span>
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
