'use client';

import { useMemo, useState } from 'react';
import type { components } from '../../types/openapi';

type ChatbotQueryDto = components['schemas']['ChatbotQueryDto'];
type ChatbotResponseDto = components['schemas']['ChatbotResponseDto'];

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Bonjour, je suis l’assistant Cebstore. Dites-moi ce que vous cherchez (ex: “chaussures pour homme”).",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function send() {
    if (!canSend) return;
    const text = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const dto: ChatbotQueryDto = {
        message: text,
        sessionId: sessionId ?? undefined,
        includeHistory: true,
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content:
              "Désolé, je n’arrive pas à répondre pour le moment. Vérifiez la configuration OpenAI.",
          },
        ]);
        return;
      }

      const data = (await res.json()) as ChatbotResponseDto;
      if (data?.sessionId) setSessionId(data.sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: data.answer ?? '' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Chatbot intelligent</h1>
            <p className="mt-1 text-sm text-foreground/70">
              Assistance à l’achat personnalisée (RAG + base de connaissances).
            </p>
          </div>
          <button
            className="btn-outline"
            onClick={() => {
              setSessionId(null);
              setMessages((m) => m.slice(0, 1));
            }}
          >
            Nouvelle session
          </button>
        </div>
      </div>

      <div className="card grid gap-3">
        <div className="grid gap-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={[
                'rounded-lg border border-border px-3 py-2 text-sm',
                msg.role === 'user' ? 'bg-muted' : 'bg-white/40 dark:bg-black/10',
              ].join(' ')}
            >
              <div className="text-xs text-foreground/60">
                {msg.role === 'user' ? 'Vous' : 'Assistant'}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="h-10 flex-1 rounded-lg border border-border bg-transparent px-3 outline-none focus:ring-2 focus:ring-brand/30"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: chaussures pour homme"
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
          />
          <button className="btn-brand" disabled={!canSend} onClick={send}>
            {loading ? '...' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );
}

