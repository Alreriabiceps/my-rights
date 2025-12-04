"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Bot, 
  User,
  Sparkles,
  X
} from "lucide-react";

export default function AIChatAssistant({ analysis }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollAreaRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async (e) => {
    e?.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    // Add user message to conversation
    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare conversation history (last 10 messages for context, excluding current message)
      // The current message will be sent separately
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Verify analysis is available
      if (!analysis) {
        console.warn("⚠️ No analysis context available for chat");
      } else {
        console.log("✅ Sending chat request with analysis context:", {
          caseType: analysis.caseType,
          hasRights: !!analysis.rights,
          hasLaws: !!analysis.relevantLaws,
          hasNextSteps: !!analysis.nextSteps,
        });
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
          analysis: analysis, // Pass full analysis for context
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add assistant response
      const assistantMessage = {
        role: "assistant",
        content: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      
      // Try to get more detailed error from response
      let errorMessage = "Paumanhin, may naganap na error. Pakisubukan muli o magtanong ng ibang bagay.";
      
      if (err.message) {
        // Show user-friendly error message
        if (err.message.includes("500") || err.message.includes("Internal Server Error")) {
          errorMessage = "May problema sa server. Pakisubukan muli sa ilang sandali.";
        } else if (err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage = "May problema sa internet connection. Pakisubukan muli.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      // Add error message to chat
      const assistantErrorMessage = {
        role: "assistant",
        content: errorMessage,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, assistantErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                AI Chat Assistant
                <Sparkles className="h-4 w-4 text-primary" />
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {analysis && analysis.caseType ? (
                  <>
                    Magtanong tungkol sa <span className="font-semibold text-primary">{analysis.caseType}</span>
                  </>
                ) : (
                  "Magtanong tungkol sa iyong kaso"
                )}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 py-4 min-h-0" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Kumusta! Ako ang AI Chat Assistant
                </h3>
                {analysis && analysis.caseType ? (
                  <>
                    <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20 max-w-md">
                      <p className="text-xs font-medium text-primary mb-1">
                        📋 Focused on Your Case:
                      </p>
                      <p className="text-sm font-semibold">{analysis.caseType}</p>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md mb-4">
                      Magtanong tungkol sa <strong>iyong kaso</strong> lamang. Ang chat assistant ay tutugon lamang sa mga tanong na may kaugnayan sa iyong kaso.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground max-w-md mb-4">
                    Magtanong tungkol sa iyong legal case.
                  </p>
                )}
                <p className="text-xs text-muted-foreground mb-4 max-w-md">
                  Halimbawa ng mga tanong na maaari mong itanong:
                </p>
                <div className="mt-2 space-y-2 w-full max-w-md">
                  {analysis && analysis.caseType ? (
                    // Case-specific examples
                    [
                      analysis.relevantLaws && analysis.relevantLaws.length > 0
                        ? `Paki-explain ang ${analysis.relevantLaws[0].law || analysis.relevantLaws[0].title} sa simpleng paraan`
                        : "Paki-explain ang mga batas na applicable sa aking kaso",
                      analysis.rights && analysis.rights.length > 0
                        ? `Ano ang mga karapatan ko sa sitwasyong ito?`
                        : "Ano ang aking mga karapatan?",
                      analysis.nextSteps && analysis.nextSteps.length > 0
                        ? `Paano ko maipapatupad ang "${analysis.nextSteps[0].action}"?`
                        : "Paano ko maipapatupad ang mga next steps?",
                      analysis.timeline?.statuteOfLimitations?.deadline
                        ? `Ano ang deadline para sa aking kaso?`
                        : "May deadline ba ang aking kaso?",
                    ].filter(Boolean).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(example)}
                        className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-sm text-muted-foreground hover:text-foreground"
                      >
                        "{example}"
                      </button>
                    ))
                  ) : (
                    // Generic examples
                    [
                      "Can you explain Article 1134 in simpler terms?",
                      "Ano ang mga karapatan ko sa sitwasyong ito?",
                      "Paano ko maipapatupad ang mga next steps?",
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(example)}
                        className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-sm text-muted-foreground hover:text-foreground"
                      >
                        "{example}"
                      </button>
                    ))
                  )}
                </div>
                {analysis && analysis.caseType && (
                  <p className="text-xs text-muted-foreground mt-4 max-w-md">
                    ⚠️ Tandaan: Ang chat assistant ay tutugon lamang sa mga tanong na may kaugnayan sa iyong kaso. Ang mga tanong na hindi related ay hindi sasagutin.
                  </p>
                )}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 animate-fade-in-up ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                    opacity: 0,
                  }}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.isError
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-secondary text-foreground"
                    }`}
                    style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                      {message.content}
                    </p>
                    {message.timestamp && (
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-fade-in-up">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Nag-iisip...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Magtanong tungkol sa iyong kaso... (Press Enter to send, Shift+Enter for new line)"
              rows={1}
              disabled={isLoading}
              className="resize-none min-h-[44px] max-h-[120px] bg-secondary/50 text-base"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 h-11 w-11"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-muted-foreground text-center">
              Ang AI assistant ay hindi pumapalit sa propesyonal na legal advice
            </p>
            {analysis && analysis.caseType && (
              <p className="text-xs text-muted-foreground/70 text-center">
                Focused on: <span className="font-medium">{analysis.caseType}</span> • Only answers questions relevant to your case
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

