export interface Env {
  AI: any;
  CONVERSATIONS: KVNamespace;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ConversationHistory {
  messages: Message[];
  createdAt: string;
  lastUpdated: string;
}

const SYSTEM_PROMPT = `You are an expert technical interviewer specializing in software engineering roles. Your goal is to conduct realistic mock interviews.

Interview Guidelines:
- Start by asking about the candidate's background and preferred role (frontend, backend, full-stack)
- Ask 3-5 technical questions appropriate to their level
- Include coding problems, system design, or behavioral questions
- Provide constructive feedback after each answer
- Be encouraging but honest about areas for improvement
- End with overall feedback and tips

Keep responses conversational and professional. Ask one question at a time.`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const { message, sessionId } = await request.json() as { message: string; sessionId: string };

        if (!message || !sessionId) {
          return new Response(JSON.stringify({ error: 'Message and sessionId required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const historyKey = `conversation:${sessionId}`;
        const existingHistory = await env.CONVERSATIONS.get(historyKey, 'json') as ConversationHistory | null;

        const messages: Message[] = existingHistory?.messages || [
          { role: 'system', content: SYSTEM_PROMPT }
        ];

        messages.push({ role: 'user', content: message });

        const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: messages,
          max_tokens: 512,
          temperature: 0.7,
        });

        const assistantMessage = response.response || 'I apologize, I encountered an error. Could you please try again?';

        messages.push({ role: 'assistant', content: assistantMessage });

        const updatedHistory: ConversationHistory = {
          messages: messages.slice(-20),
          createdAt: existingHistory?.createdAt || new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };

        await env.CONVERSATIONS.put(historyKey, JSON.stringify(updatedHistory), {
          expirationTtl: 86400,
        });

        return new Response(JSON.stringify({ 
          response: assistantMessage,
          sessionId 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (url.pathname === '/api/reset' && request.method === 'POST') {
      try {
        const { sessionId } = await request.json() as { sessionId: string };
        
        if (sessionId) {
          await env.CONVERSATIONS.delete(`conversation:${sessionId}`);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};
