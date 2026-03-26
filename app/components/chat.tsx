"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Render markdown links and bold as HTML
function renderContent(text: string) {
  if (!text) return null;

  // Split by markdown links [text](url) and bold **text**
  const parts: Array<{ type: "text" | "link" | "bold"; value: string; href?: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Find next markdown link or bold
    const linkMatch = remaining.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    const linkIdx = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity;
    const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;

    if (linkIdx === Infinity && boldIdx === Infinity) {
      parts.push({ type: "text", value: remaining });
      break;
    }

    if (linkIdx <= boldIdx && linkMatch) {
      if (linkIdx > 0) parts.push({ type: "text", value: remaining.slice(0, linkIdx) });
      parts.push({ type: "link", value: linkMatch[1], href: linkMatch[2] });
      remaining = remaining.slice(linkIdx + linkMatch[0].length);
    } else if (boldMatch) {
      if (boldIdx > 0) parts.push({ type: "text", value: remaining.slice(0, boldIdx) });
      parts.push({ type: "bold", value: boldMatch[1] });
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    }
  }

  return (
    <>
      {parts.map((p, i) => {
        if (p.type === "link") {
          return (
            <a
              key={i}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6719] underline underline-offset-2 hover:text-[#e55a14]"
            >
              {p.value}
            </a>
          );
        }
        if (p.type === "bold") {
          return <strong key={i} className="font-semibold text-white">{p.value}</strong>;
        }
        return <span key={i}>{p.value}</span>;
      })}
    </>
  );
}

export default function Chat() {
  const ALL_QUESTIONS = [
    "What's the best AI for search?",
    "How do I set up Claude the right way?",
    "What are the 7 deadly sins of prompting?",
    "How can I grow on LinkedIn with AI?",
    "Is ChatGPT getting worse?",
    "How do I train ChatGPT to write like me?",
    "What's the ideal prompt length?",
    "How do I make AI slides?",
    "Which AI makes the best images?",
    "How do I use AI inside spreadsheets?",
    "What's better: ChatGPT or Claude?",
    "How to vibe code without coding?",
    "What AI tools does Ruben pay for?",
    "How to make carousels with AI?",
    "Is AI detection a scam?",
    "How to use AI for business plans?",
    "What's the best way to search with AI?",
    "How to replace consultants with AI?",
    "What's Claude Cowork?",
    "How to prompt ChatGPT with context?",
  ];

  function pickRandom() {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(pickRandom);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const streamResponse = useCallback(async (text: string, prevMessages: Message[]) => {
    const userMsg: Message = { role: "user" as const, content: text };
    const newMessages: Message[] = [...prevMessages, userMsg, { role: "assistant" as const, content: "" }];
    setMessages(newMessages);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: prevMessages.slice(-4),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: err.error || "Something went wrong." };
          return updated;
        });
        setStreaming(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ") && line.slice(6) !== "[DONE]") {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  updated[updated.length - 1] = { ...last, content: last.content + parsed.text };
                  return updated;
                });
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Network error. Try again." };
        return updated;
      });
    }

    setStreaming(false);
  }, []);

  function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    streamResponse(text, messages);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-[#FF6719] hover:bg-[#e55a14] shadow-lg shadow-black/30 flex items-center justify-center transition-all cursor-pointer z-50 hover:scale-105"
          aria-label="Open chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 w-[360px] h-[500px] max-h-[80vh] bg-[#171717] border border-[#252525] rounded-xl shadow-2xl shadow-black/50 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#252525]">
            <div>
              <p className="text-white text-[13px] font-semibold">Ask How to AI</p>
              <p className="text-[#777] text-[10px]">Answers from 72 newsletters</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-md hover:bg-[#252525] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center pt-12">
                <p className="text-[#555] text-[12px] mb-3">Ask anything about the newsletters</p>
                <div className="space-y-1.5">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => streamResponse(q, [])}
                      disabled={streaming}
                      className="block w-full text-left text-[11px] text-[#999] hover:text-[#FF6719] border border-[#252525] hover:border-[#FF6719]/20 rounded-lg px-3 py-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSuggestions(pickRandom())}
                  className="mt-3 text-[10px] text-[#555] hover:text-[#FF6719] transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6" />
                    <path d="M2.5 22v-6h6" />
                    <path d="M2.5 11.5a10 10 0 0 1 18.8-4.3" />
                    <path d="M21.5 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                  New questions
                </button>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-[12px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#FF6719] text-white"
                      : "bg-[#1e1e1e] border border-[#252525] text-[#ccc]"
                  }`}
                >
                  {msg.content ? (
                    msg.role === "assistant" ? renderContent(msg.content) : msg.content
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF6719] animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF6719] animate-pulse [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF6719] animate-pulse [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#252525]">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask about the newsletters..."
                disabled={streaming}
                maxLength={500}
                className="flex-1 rounded-lg border border-[#252525] bg-[#1e1e1e] px-3 py-2 text-white text-[12px] placeholder:text-[#555] focus:outline-none focus:border-[#FF6719] focus:ring-1 focus:ring-[#FF6719]/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={send}
                disabled={streaming || !input.trim()}
                className="rounded-lg bg-[#FF6719] hover:bg-[#e55a14] text-white px-3 py-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
