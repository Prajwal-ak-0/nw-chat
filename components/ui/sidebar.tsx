"use client";

import Link from "next/link"
import { Plus, ChevronLeft } from "lucide-react"
import { Button } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  resetChat: () => void
}

const navItems = [
  { icon: Plus, label: "New Chat", tooltip: "Start a new conversation" },
]

export function Sidebar({ isOpen, setIsOpen, resetChat }: SidebarProps) {

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed left-0 top-0 h-full z-50 hidden md:block">
        {/* Expanded sidebar */}
        <div 
          className={`
            fixed left-0 top-0 h-full w-[280px] sm:w-[300px] md:w-80 bg-white border-r border-gray-200
            transform-gpu transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
          `}
        >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200 h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className={`flex items-center justify-center ${isOpen ? 'w-48 sm:w-52 md:w-60 h-10 sm:h-11 md:h-12' : 'w-8 h-8'} transition-all duration-300`}>
                <img src="/logo.webp" alt="Next-Wealth Logo" className={`${isOpen ? 'w-full h-full' : 'w-8 h-8'} object-contain transition-all duration-300`} />
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-black hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-2">
            {navItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => resetChat()}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors
                      ${isOpen ? 'justify-start' : 'justify-center'}`}
                  >
                    <item.icon className="w-6 h-6" />
                    {isOpen && <span className="text-base">{item.label}</span>}
                  </button>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right" className="bg-white text-black border border-gray-200 shadow-lg">
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </div>
        </div>
        {/* Collapsed sidebar */}
        <div 
          className={`
            fixed left-0 top-0 h-full w-16 sm:w-18 md:w-20 bg-white border-r border-gray-200
            transform-gpu transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 h-16">
              <Link href="/" className="flex items-center justify-center">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/logo.webp" alt="Next-Wealth Logo" className="w-6 h-6 object-contain" />
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-black hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
              >
                <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-2">
              {navItems.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => resetChat()}
                      className="flex items-center justify-center px-4 py-3 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white text-black border border-gray-200 shadow-lg">
                    <p>{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
