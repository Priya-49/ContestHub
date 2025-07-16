"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onFilterToggle: () => void
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
  onFilterToggle,
}: HeroSectionProps) {
  return (
    <div className="p-4">
      {/* Changed bg-black to bg-zinc-900 for a slightly softer, but still very dark, tone */}
      <div className="relative h-80 bg-zinc-900 rounded-xl">
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Coding Contests
            </h1>
            {/* Kept text-gray-300, which should still provide good contrast */}
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Find and participate in programming contests from top platforms worldwide
            </p>
          </div>

          <div className="flex gap-3 w-full max-w-2xl">
            <Button
              variant="secondary"
              // Adjust button background if needed for new contrast, but white/95 should still work well
              className="lg:hidden bg-white/95 hover:bg-white text-gray-700 border-0 h-10 px-3"
              onClick={onFilterToggle}
            >
              <Filter className="h-4 w-4" />
            </Button>

            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Search contests by name or platform..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 w-full bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-white/50 h-10 text-sm rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}