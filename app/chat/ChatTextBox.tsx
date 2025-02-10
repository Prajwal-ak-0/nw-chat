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
    <div className="w-full py-2 sm:py-3 md:py-4 fixed bottom-0 left-0 bg-white border-t border-gray-100">
      <form onSubmit={onSubmit} className="max-w-3xl sm:max-w-4xl mx-auto relative px-2 sm:px-3 md:px-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            backgroundColor: "#e1e1e1",
          }}
          className={`min-h-[50px] sm:min-h-[60px] md:min-h-[90px] max-h-[150px] sm:max-h-[200px] md:max-h-[400px] flex flex-1 w-full pt-2.5 sm:pt-3 md:pt-4 pb-7 sm:pb-8 md:pb-10 pl-3 sm:pl-4 md:pl-5 pr-9 sm:pr-10 md:pr-12 resize-none focus:outline-none text-sm sm:text-base md:text-xl rounded-xl sm:rounded-2xl md:rounded-3xl border-0 focus:ring-0 focus:ring-offset-0 ${className}`}
          disabled={disabled}
          rows={2}
          onKeyDown={handleKeyDown}
        />
        <button 
          type="submit"
          className="absolute right-3.5 sm:right-4 md:right-5 bottom-2 sm:bottom-2.5 md:bottom-3 p-1.5 sm:p-1.5 md:p-2 text-black bg-green-600 hover:bg-green-700 rounded-lg sm:rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || !value.trim()}
        >
          <SendHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatTextBox;
