"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface MobileNavbarProps {
  resetChat: () => void;
}

export function MobileNavbar({ resetChat }: MobileNavbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:hidden z-50">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-24 sm:w-28 md:w-32 h-8 sm:h-10 md:h-12 flex items-center justify-center">
          <img src="/logo.webp" alt="Next-Wealth Logo" className="w-full h-full object-contain" />
        </div>
      </Link>
      
      <button
        onClick={resetChat}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-colors"
        aria-label="New Conversation"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
