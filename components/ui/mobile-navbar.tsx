"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface MobileNavbarProps {
  resetChat: () => void;
}

export function MobileNavbar({ resetChat }: MobileNavbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#161616] border-b border-[#2D2D2D] flex items-center justify-between px-4 sm:px-6 lg:hidden z-50">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span className="text-white font-semibold text-lg">Next-Wealth</span>
      </Link>
      
      <button
        onClick={resetChat}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D2D2D] transition-colors"
        aria-label="New Conversation"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
