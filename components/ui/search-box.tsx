"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Globe, SendHorizontal } from "lucide-react"
import { useState } from "react"

export function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-[850px] mx-auto mb-8">
      <h1 className="text-4xl font-semibold text-white text-center mb-8 tracking-tight">
        What do you want to know?
      </h1>
      
      <div className="relative w-full">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-h-[80px] bg-[#161616] border border-[#2D2D2D] hover:border-[#404040] focus:border-[#404040] text-white px-6 py-6 pr-28 rounded-2xl text-lg placeholder:text-gray-400 focus:outline-none resize-none"
            placeholder="Ask anything..."
            style={{ height: '80px' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-[#2D2D2D] h-12 w-12"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-[#2D2D2D] h-12 w-12"
              disabled={!query}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
