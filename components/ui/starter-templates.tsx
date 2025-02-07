"use client";

import { Card } from "@/components/ui/card";
import { Brain, Bot, Sparkles, Users } from "lucide-react";

const templates = [
  {
    icon: <Users className="h-5 w-5" />,
    title: "Human-in-the-Loop AI",
    description: "How can we effectively combine human expertise with AI systems?",
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: "AI Feedback Loops",
    description: "What are best practices for human feedback in AI training?",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "AI Safety",
    description: "How do we ensure AI systems remain under human control?",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Augmentation",
    description: "Ways to enhance human capabilities with AI assistance",
  },
];

export function StarterTemplates() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-[850px] mx-auto">
      {templates.map((template, index) => (
        <Card
          key={index}
          className="bg-[#161616] border-[#2D2D2D] hover:border-[#404040] hover:bg-[#1A1A1A] transition-colors p-4 cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="text-[#4B9CFF] group-hover:text-[#69AEFF]">
              {template.icon}
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">{template.title}</h3>
              <p className="text-sm text-gray-400">{template.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
