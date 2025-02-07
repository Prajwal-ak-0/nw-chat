"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/ui/sidebar";
import ChatTextBox from "./chat/ChatTextBox";
import CenteredChatTextBox from "./chat/CenteredChatTextBox";
import StarterTemplates from "./components/StarterTemplates";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-white">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-medium mt-4 mb-2 text-white">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-xl leading-relaxed mb-4 text-white">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc text-xl pl-6 mb-4 space-y-2 text-white">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-white">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-2">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-neutral-400 hover:text-neutral-300 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ node, inline, className, children, ...props }: {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  } & React.HTMLAttributes<HTMLElement>) => (
    <code
      className={`${className} ${inline ? 'text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded' : 'block bg-neutral-800 p-4 rounded-lg overflow-x-auto'}`}
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ query: userMessage })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
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
    <div className="min-h-screen bg-[#0C0C0C] text-white flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`
        flex-1
        transform-gpu transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'ml-80' : 'ml-20'}
        relative h-screen overflow-hidden
      `}>
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="max-w-4xl w-full space-y-8">
              <CenteredChatTextBox
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <StarterTemplates 
                onTemplateSelect={(query) => {
                  setInput(query);
                  handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                }} 
              />
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 max-w-4xl w-full mx-auto px-4 pb-36 overflow-hidden">
              <div className="h-full overflow-y-auto" id="messages-container">
                <div className="space-y-8 pt-8">

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end ml-32"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl px-6 pt-4 ${message.role === "assistant" ? "bg-[#1C1C1C] text-white" : "bg-neutral-700 text-white"}`}
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
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
                  </div>
                )}
                <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-[#0C0C0C] border-t border-neutral-800">
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
