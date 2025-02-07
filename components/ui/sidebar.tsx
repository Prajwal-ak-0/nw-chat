"use client";

import Link from "next/link"
import { Menu, Plus, Search, Globe, Sparkles, Cloud, ChevronLeft } from "lucide-react"
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
}

const navItems = [
  { icon: Plus, label: "New Chat", href: "/", tooltip: "Start a new conversation" },
  { icon: Search, label: "Search", href: "/search", tooltip: "Search through your chats" },
  { icon: Globe, label: "Discover", href: "/discover", tooltip: "Explore trending topics" },
  { icon: Sparkles, label: "Labs", href: "/labs", tooltip: "Try experimental features" },
  { icon: Cloud, label: "Copilot", href: "/copilot", tooltip: "AI-powered assistance" },
]

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed left-0 top-0 h-full z-50">
        {/* Expanded sidebar */}
        <div 
          className={`
            fixed left-0 top-0 h-full w-80 bg-[#161616] border-r border-[#2D2D2D]
            transform-gpu transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
          `}
        >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-[#2D2D2D] h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              {isOpen && (
                <span className="text-white font-semibold text-lg">AI Assistant</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-[#2D2D2D]"
              onClick={() => setIsOpen(!isOpen)}
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-2">
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D2D2D] transition-colors
                      ${isOpen ? 'justify-start' : 'justify-center'}`}
                  >
                    <item.icon className="w-6 h-6" />
                    {isOpen && <span className="text-base">{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right" className="bg-[#2D2D2D] text-white border-[#404040]">
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
            fixed left-0 top-0 h-full w-20 bg-[#161616] border-r border-[#2D2D2D]
            transform-gpu transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#2D2D2D] h-16">
              <Link href="/" className="flex items-center justify-center">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-[#2D2D2D]"
                onClick={() => setIsOpen(!isOpen)}
              >
                <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-2">
              {navItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className="flex items-center justify-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D2D2D] transition-colors"
                    >
                      <item.icon className="w-6 h-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#2D2D2D] text-white border-[#404040]">
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
