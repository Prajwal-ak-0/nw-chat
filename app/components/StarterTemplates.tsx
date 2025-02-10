"use client";

interface StarterTemplate {
  title: string;
  description: string;
  query: string;
}

const templates: StarterTemplate[] = [
  {
    title: "Human Oversight",
    description: "How can we implement effective human oversight in AI systems?",
    query: "What are the best practices for implementing human oversight in AI systems to ensure safety and reliability while maintaining efficiency?"
  },
  {
    title: "Safety Protocols",
    description: "What safety measures should be in place for AI deployment?",
    query: "Detail the critical safety protocols and human intervention points needed when deploying AI systems in production environments."
  },
  {
    title: "HITL Decision Points",
    description: "When should human intervention be required in AI workflows?",
    query: "What are the critical decision points in AI workflows where human-in-the-loop (HITL) intervention should be mandatory, and how can we design systems to seamlessly integrate human judgment?"
  },
  {
    title: "HITL Feedback Loop",
    description: "How to optimize AI systems using human feedback?",
    query: "Explain how to design and implement effective feedback loops between AI systems and human operators to continuously improve model performance and maintain quality control."
  }
];

import { API_URL } from "@/config/api";

interface StarterTemplatesProps {
  onNewMessage: (message: { role: "user" | "assistant", content: string }) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function StarterTemplates({ 
  onNewMessage,
  sessionId,
  setSessionId,
  setIsLoading
}: StarterTemplatesProps) {
  const handleTemplateClick = async (template: StarterTemplate) => {
    // Add user message immediately
    onNewMessage({ role: "user", content: template.query });
    setIsLoading(true);

    try {
      const url = `${API_URL}/chat`;
      console.log('Making API request to:', url);
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          query: template.query,
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

      // Add assistant's response
      onNewMessage({ role: "assistant", content: data.response });
    } catch (error) {
      console.error("Error:", error);
      onNewMessage({ 
        role: "assistant", 
        content: "I apologize, but I encountered an error processing your request. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => handleTemplateClick(template)}
            className="group p-4 sm:p-5 md:p-6 bg-gray-50 hover:bg-green-50 rounded-xl sm:rounded-2xl text-left transition-all duration-200 border border-gray-200 hover:border-green-600"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 text-black group-hover:text-black">
              {template.title}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm group-hover:text-black line-clamp-2 sm:line-clamp-none">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
