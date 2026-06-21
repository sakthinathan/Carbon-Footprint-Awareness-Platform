"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getIdToken } from "@/infrastructure/firebase/auth";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const SUGGESTED_PROMPTS = [
  "What are my top 3 emission reduction opportunities?",
  "How can I reduce Scope 2 emissions from electricity?",
  "Explain the difference between Scope 1, 2, and 3 emissions",
  "What is a Science-Based Target and should we set one?",
  "How do I calculate employee commuting emissions?",
];

export default function AiAdvisorPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: `👋 Hello! I'm **EcoAdvisor**, your AI-powered carbon reduction specialist.\n\nI can help you:\n- 🎯 Identify your highest-impact reduction opportunities\n- 📊 Interpret your emissions data and trends\n- 🌱 Build a net-zero roadmap\n- 📋 Understand regulatory frameworks (CSRD, TCFD, GHG Protocol)\n\nWhat would you like to explore today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;
    setInput("");

    const currentTimestamp = new Date();
    const userMsgId = currentTimestamp.getTime().toString();
    const aiMsgId = (currentTimestamp.getTime() + 1).toString();

    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: currentTimestamp,
    };
    const aiMsg: Message = {
      id: aiMsgId,
      role: "ai",
      content: "",
      timestamp: currentTimestamp,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setStreaming(true);

    try {
      const token = await getIdToken();
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role === "ai" ? "model" : "user", content: m.content }));

      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, history }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.chunk) {
                setMessages((prev) =>
                  prev.map((m) => (m.id === aiMsgId ? { ...m, content: m.content + parsed.chunk } : m))
                );
              }
              if (parsed.done) break;
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: "⚠️ Sorry, I couldn't connect to the AI. Please ensure the backend is running." }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  }, [messages, streaming]);

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>")
      .replace(/^- (.+)/gm, "• $1");
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow"
            style={{ background: "linear-gradient(135deg, #16a34a, #10b981)" }}
          >
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#f0fdf4" }}>AI Advisor</h1>
            <p className="text-xs" style={{ color: "rgba(134,239,172,0.5)" }}>
              Powered by Google Gemini 1.5 Pro · Carbon expertise
            </p>
          </div>
        </div>
        <button
          onClick={() => setMessages([])}
          className="btn-ghost text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> New Chat
        </button>
      </div>

      {/* Chat area */}
      <div
        className="glass-card flex-1 overflow-y-auto p-5 space-y-4 mb-4"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-fade-in-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #16a34a, #10b981)" }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}

            <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
              {msg.content === "" && msg.role === "ai" ? (
                <div className="flex gap-1.5 items-center py-1">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              ) : (
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              )}
              <p className="text-xs mt-2 opacity-40">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {msg.role === "user" && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: "rgba(22,163,74,0.2)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.3)" }}
              >
                {user?.displayName?.[0] || "U"}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="mb-3 flex flex-wrap gap-2 animate-fade-in-up">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="text-xs py-1.5 px-3 rounded-lg transition-all"
              style={{
                background: "rgba(22,163,74,0.06)",
                border: "1px solid rgba(22,163,74,0.15)",
                color: "rgba(134,239,172,0.7)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(22,163,74,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(22,163,74,0.15)"; }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card p-3 flex gap-2 items-end animate-fade-in-up">
        <textarea
          className="eco-input flex-1 resize-none text-sm"
          rows={2}
          placeholder="Ask about emission reduction, regulatory compliance, net-zero strategies..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          disabled={streaming}
          style={{ border: "none", background: "transparent", outline: "none", padding: "0.5rem 0" }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || streaming}
          className="btn-primary py-2.5 px-4 flex-shrink-0 disabled:opacity-40"
        >
          {streaming ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-center text-xs mt-2" style={{ color: "rgba(134,239,172,0.3)" }}>
        EcoAdvisor uses Gemini AI. Always verify recommendations with qualified sustainability professionals.
      </p>
    </div>
  );
}
