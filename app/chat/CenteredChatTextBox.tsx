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
    <div className="w-full max-w-3xl sm:max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2 md:mb-4">How can I help you today?</h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Welcome to Next-Wealth Chat - I&apos;m here to assist!</p>
      </div>
      <form onSubmit={onSubmit} className="relative shadow-2xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/80 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`relative min-h-[50px] sm:min-h-[60px] md:min-h-[90px] max-h-[150px] sm:max-h-[200px] md:max-h-[400px] flex flex-1 w-full pt-2.5 sm:pt-3 md:pt-4 pb-7 sm:pb-8 md:pb-10 pl-3 sm:pl-4 md:pl-5 pr-9 sm:pr-10 md:pr-12 resize-none focus:outline-none text-sm sm:text-base md:text-xl bg-background text-foreground rounded-xl sm:rounded-2xl md:rounded-3xl border border-input focus:border-primary active:border-primary placeholder:text-muted-foreground ${className}`}
          disabled={disabled}
          rows={2}
          onKeyDown={handleKeyDown}
        />
        <button 
          type="submit"
          className="absolute right-3 sm:right-3.5 md:right-4 bottom-2 sm:bottom-3 md:bottom-4 p-1.5 sm:p-1.5 md:p-2 text-white bg-neutral-700 hover:bg-neutral-600 rounded-lg sm:rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || !value.trim()}
        >
          <SendHorizontal className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
        </button>
      </form>
    </div>
  );
};

export default CenteredChatTextBox;
