"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNavbar } from "@/components/ui/mobile-navbar";
import ChatTextBox from "./chat/ChatTextBox";
import CenteredChatTextBox from "./chat/CenteredChatTextBox";
import StarterTemplates from "./components/StarterTemplates";
import { API_URL } from "@/config/api";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-3 sm:mb-4 text-foreground">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc text-base sm:text-lg md:text-xl pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-foreground text-base sm:text-lg md:text-xl">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-2">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ inline, className, children, ...props }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  } & React.HTMLAttributes<HTMLElement>) => (
    <code
      className={`${className} ${inline ? 'text-primary bg-muted px-1 py-0.5 rounded' : 'block bg-muted p-4 rounded-lg overflow-x-auto'}`}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-transparent">{children}</pre>
  ),
};

interface ChatMessage {
  content: string;
  role: "user" | "assistant";
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("first_query");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetChat = () => {
    // Clear all items from localStorage
    localStorage.clear();
    
    // Reset state
    setMessages([]);
    setSessionId("first_query");
    setInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedSessionId = localStorage.getItem('sessionId');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  // Save messages and sessionId to localStorage whenever they change
  useEffect(() => {
    if (sessionId !== "first_query") {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      localStorage.setItem('sessionId', sessionId);
    }
  }, [messages, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    // If this is a new session, we don't need to clear localStorage here
    // as it will be handled by the messages/sessionId useEffect
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      console.log(`${API_URL}/chat`)
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          query: userMessage,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update session ID if this was the first query
      if (sessionId === "first_query" && data.conversation_id) {
        setSessionId(String(data.conversation_id));
      }

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.response || "No response received from server"
      }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Error: ${error instanceof Error ? error.message : 'Failed to connect to server. Please check if the backend is running.'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Navbar - only visible on mobile/tablet */}
      <MobileNavbar 
        resetChat={() => {
          setMessages([]);
          setSessionId("first_query");
          setInput("");
        }} 
      />

      {/* Sidebar - only visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          resetChat={() => {
            setMessages([]);
            setSessionId("first_query");
            setInput("");
          }} 
        />
      </div>

      <main className={`
        flex-1
        transform-gpu transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-20'}
        relative h-screen overflow-hidden
        ${messages.length > 0 ? 'pt-16 lg:pt-0' : 'pt-16 lg:pt-0'}
      `}>
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="max-w-3xl sm:max-w-4xl w-full space-y-6 sm:space-y-8 px-3 sm:px-4">
              <CenteredChatTextBox
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <StarterTemplates 
                onNewMessage={(message) => setMessages(prev => [...prev, message])}
                sessionId={sessionId}
                setSessionId={setSessionId}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 max-w-3xl sm:max-w-4xl w-full mx-auto px-2 sm:px-4 pb-24 sm:pb-28 md:pb-36 overflow-hidden">
              <div className="h-full overflow-y-auto" id="messages-container">
                <div className="space-y-6 sm:space-y-8 pt-16 sm:pt-18 lg:pt-8">

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end sm:ml-16 md:ml-24 lg:ml-32"}`}
                  >
                    <div
                      className={`max-w-[92%] sm:max-w-[85%] rounded-xl sm:rounded-2xl md:rounded-3xl px-3 sm:px-4 md:px-6 pt-2 sm:py-4
                        ${message.role === "assistant" ? "bg-white text-black" : "bg-[#f2f2f2] text-white"}`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={markdownComponents}
                        className="prose prose-invert max-w-none"
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-center mb-4">
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-neutral-500" />
                  </div>
                )}
                <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
              <div className="max-w-4xl mx-auto px-4">
                <ChatTextBox
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
