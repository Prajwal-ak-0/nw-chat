"use client";

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';

interface CenteredChatTextBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CenteredChatTextBox: React.FC<CenteredChatTextBoxProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  className,
  disabled
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">How can I help you today?</h1>
        <p className="text-base sm:text-lg text-gray-400">Welcome to Next-Wealth Chat - I&apos;m here to assist!</p>
      </div>
      <form onSubmit={onSubmit} className="relative shadow-2xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`relative min-h-[60px] sm:min-h-[90px] max-h-[200px] sm:max-h-[400px] flex flex-1 w-full pt-3 sm:pt-4 pb-8 sm:pb-10 pl-4 sm:pl-5 pr-10 sm:pr-12 resize-none focus:outline-none text-base sm:text-xl bg-[#1C1C1C] text-white rounded-2xl sm:rounded-3xl border border-gray-700 focus:border-neutral-500 active:border-neutral-500 placeholder:text-gray-400 ${className}`}
          disabled={disabled}
          rows={2}
          onKeyDown={handleKeyDown}
        />
        <button 
          type="submit"
          className="absolute right-4 bottom-4 p-2 text-white bg-neutral-700 hover:bg-neutral-600 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || !value.trim()}
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default CenteredChatTextBox;
