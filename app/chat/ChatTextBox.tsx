"use client";

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';

interface ChatTextBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const ChatTextBox: React.FC<ChatTextBoxProps> = ({
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
    <div className="w-full py-4">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`min-h-[90px] max-h-[400px] flex flex-1 w-full pt-4 pb-10 pl-5 pr-12 resize-none focus:outline-none text-xl bg-[#1C1C1C] text-white rounded-3xl border border-gray-700 focus:border-neutral-600 active:border-neutral-600 placeholder:text-gray-400 ${className}`}
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

export default ChatTextBox;
