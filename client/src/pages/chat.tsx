import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppNavbar } from "@/components/app-navbar";
import { Send, ChevronLeft, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("userDisplayName");
    if (savedName) {
      setUserName(savedName);
      // Add welcome message
      setMessages([{
        id: "1",
        role: "assistant",
        content: `Hello ${savedName}! I'm Elara, your spiritual companion. I'm here to listen, guide, and share wisdom from scripture with you. How can I support your faith journey today?`,
        timestamp: new Date(),
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          userName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.reply) {
        const errorMsg = data.error || "Unable to get a response. Please try again.";
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I encountered an issue: ${errorMsg}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setLoading(false);
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered a connection error. Please check your internet and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pb-32 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7a1fc3] to-[#61219a] flex items-center justify-center shadow-lg">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                Chat with Elara
              </h1>
              <p className="text-sm text-gray-500">Your spiritual companion</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/media')}
            variant="ghost"
            size="icon"
            className="text-purple-600 hover:bg-purple-50"
            data-testid="button-back-chat"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat Messages */}
        <Card className="bg-white border-purple-100 overflow-hidden flex flex-col flex-1 mb-4 animate-fade-in shadow-lg">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-2xl px-5 py-3 rounded-xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#7a1fc3] to-[#61219a] text-white rounded-br-none shadow-md"
                      : "bg-gradient-to-br from-purple-50 to-white text-gray-800 border border-purple-200 rounded-bl-none shadow-sm"
                  }`}
                  data-testid={`message-${msg.role}-${msg.id}`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-xs opacity-60 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 px-5 py-3 rounded-xl rounded-bl-none shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Input */}
        <div className="flex gap-2 animate-fade-in">
          <Input
            placeholder="Share your thoughts, ask for guidance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            disabled={loading}
            className="text-base"
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-[#7a1fc3] to-[#61219a] hover:opacity-90 text-white"
            size="icon"
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AppNavbar />
    </div>
  );
}
