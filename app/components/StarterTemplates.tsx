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
  }
];

interface StarterTemplatesProps {
  onTemplateSelect: (query: string) => void;
}

export default function StarterTemplates({ onTemplateSelect }: StarterTemplatesProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onTemplateSelect(template.query)}
            className="group p-6 bg-[#1C1C1C] rounded-2xl text-left transition-all duration-200 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
          >
            <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-white">
              {template.title}
            </h3>
            <p className="text-neutral-400 text-sm group-hover:text-neutral-300">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
