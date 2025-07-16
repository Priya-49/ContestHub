"use client"

import { useState } from "react"
import { ChevronDown, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// Props type definition for the FilterSidebar
interface FilterSidebarProps {
  selectedPlatforms: string[]
  selectedDifficulties: string[]
  selectedStatuses: string[]
  onPlatformsChange: (platforms: string[]) => void
  onDifficultiesChange: (difficulties: string[]) => void
  onStatusesChange: (statuses: string[]) => void
  onClose?: () => void // Optional prop to close the sidebar (useful for mobile)
}

export default function FilterSidebar({
  selectedPlatforms,
  selectedDifficulties,
  selectedStatuses,
  onPlatformsChange,
  onDifficultiesChange,
  onStatusesChange,
  onClose,
}: FilterSidebarProps) {
  // State to toggle visibility of each filter section
  const [openSections, setOpenSections] = useState({
    platform: true,
    difficulty: true,
    status: true,
  })

  // Static data for each filter category
  const platforms = ["Codeforces", "LeetCode", "CodeChef", "GeeksforGeeks", "Naukri", "AtCoder" ,"Others"]
  const difficulties = ["Beginner", "Medium", "Hard"]
  const statuses = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Ended", value: "ended" },
  ]

  // Function to toggle open/close state of a filter section
  function toggleSection(section: string) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }))
  }

  // Handle checkbox state change for platform filter
  function handlePlatformChange(platform: string, checked: boolean) {
    if (checked) {
      onPlatformsChange([...selectedPlatforms, platform])
    } else {
      onPlatformsChange(selectedPlatforms.filter((p) => p !== platform))
    }
  }

  // Handle checkbox state change for difficulty filter
  function handleDifficultyChange(difficulty: string, checked: boolean) {
    if (checked) {
      onDifficultiesChange([...selectedDifficulties, difficulty])
    } else {
      onDifficultiesChange(selectedDifficulties.filter((d) => d !== difficulty))
    }
  }

  // Handle checkbox state change for status filter
  function handleStatusChange(status: string, checked: boolean) {
    if (checked) {
      onStatusesChange([...selectedStatuses, status])
    } else {
      onStatusesChange(selectedStatuses.filter((s) => s !== status))
    }
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen pr-8 py-8 pl-20 w-72">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        {/* Close button (visible on mobile) */}
        {onClose && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* PLATFORM FILTER SECTION */}
        <div>
          <button
            onClick={() => toggleSection("platform")}
            className="flex items-center justify-between w-full p-0 text-left"
          >
            <h3 className="text-sm font-medium text-gray-900">Platform</h3>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform pl-0 ml-0 mr-0 ${openSections.platform ? "rotate-180" : ""}`}
            />
          </button>

          {/* Render platform checkboxes if section is open */}
          {openSections.platform && (
            <div className="mt-3 space-y-3">
              {platforms.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform}`}
                    checked={selectedPlatforms.includes(platform)}
                    onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                  />
                  <label htmlFor={`platform-${platform}`} className="text-sm text-gray-700 cursor-pointer">
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIFFICULTY FILTER SECTION */}
        <div>
          <button
            onClick={() => toggleSection("difficulty")}
            className="flex items-center justify-between w-full p-0 text-left"
          >
            <h3 className="text-sm font-medium text-gray-900">Difficulty</h3>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform mr-0 ${openSections.difficulty ? "rotate-180" : ""}`}
            />
          </button>

          {/* Render difficulty checkboxes if section is open */}
          {openSections.difficulty && (
            <div className="mt-3 space-y-3">
              {difficulties.map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty}`}
                    checked={selectedDifficulties.includes(difficulty)}
                    onCheckedChange={(checked) => handleDifficultyChange(difficulty, checked as boolean)}
                  />
                  <label htmlFor={`difficulty-${difficulty}`} className="text-sm text-gray-700 cursor-pointer">
                    {difficulty}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATUS FILTER SECTION */}
        <div>
          <button
            onClick={() => toggleSection("status")}
            className="flex items-center justify-between w-full p-0 text-left"
          >
            <h3 className="text-sm font-medium text-gray-900">Status</h3>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform mr-0 ${openSections.status ? "rotate-180" : ""}`}
            />
          </button>

          {/* Render status checkboxes if section is open */}
          {openSections.status && (
            <div className="mt-3 space-y-3">
              {statuses.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={selectedStatuses.includes(status.value)}
                    onCheckedChange={(checked) => handleStatusChange(status.value, checked as boolean)}
                  />
                  <label htmlFor={`status-${status.value}`} className="text-sm text-gray-700 cursor-pointer">
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}