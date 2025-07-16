"use client"

import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FilterSidebar from "@/components/filter-sidebar"
import ContestGrid from "@/components/contest-grid"
import Pagination from "@/components/pagination"
import useContests from "@/hooks/useContests"
import useFilteredContests from "@/hooks/useFilteredContests"
import usePagination from "@/hooks/usePagination"
import { useState } from "react"

export default function HomePage() {
  const {
    contests,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedPlatforms,
    setSelectedPlatforms,
    selectedDifficulties,
    setSelectedDifficulties,
    selectedStatuses,
    setSelectedStatuses,
  } = useContests()

  const filteredContests = useFilteredContests({
    contests,
    searchQuery,
    selectedPlatforms,
    selectedDifficulties,
    selectedStatuses,
  })

  const {
    currentPage,
    setCurrentPage,
    currentContests,
    totalPages,
  } = usePagination(filteredContests, 6)

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setIsMobileFilterOpen(true)}
      />

      <div className="flex">
        <div className="hidden lg:block">
          <FilterSidebar
            selectedPlatforms={selectedPlatforms}
            selectedDifficulties={selectedDifficulties}
            selectedStatuses={selectedStatuses}
            onPlatformsChange={setSelectedPlatforms}
            onDifficultiesChange={setSelectedDifficulties}
            onStatusesChange={setSelectedStatuses}
          />
        </div>

        {isMobileFilterOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <FilterSidebar
                selectedPlatforms={selectedPlatforms}
                selectedDifficulties={selectedDifficulties}
                selectedStatuses={selectedStatuses}
                onPlatformsChange={setSelectedPlatforms}
                onDifficultiesChange={setSelectedDifficulties}
                onStatusesChange={setSelectedStatuses}
                onClose={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </>
        )}

        <div className="flex-1">
          {error && (
            <div className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md text-center mx-4 my-4">
              {error}
            </div>
          )}

          <ContestGrid contests={currentContests} loading={loading} totalCount={filteredContests.length} />

          {!loading && !error && totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>
    </div>
  )
}


// "use client" (without hooks)

// import { useState, useEffect } from "react"
// import type { Contest } from "@/types/contest"
// import { getContests } from "@/data/contests" // Make sure this import path is correct
// import Navbar from "@/components/navbar"
// import HeroSection from "@/components/hero-section"
// import FilterSidebar from "@/components/filter-sidebar"
// import ContestGrid from "@/components/contest-grid"
// import Pagination from "@/components/pagination"

// export default function HomePage() {
//   const [contests, setContests] = useState<Contest[]>([])
//   const [filteredContests, setFilteredContests] = useState<Contest[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
//   const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
//   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
//   const [fetchError, setFetchError] = useState<string | null>(null) // New state for API errors

//   const itemsPerPage = 6

//   // Load contests
//   useEffect(() => {
//     async function loadContests() {
//       setLoading(true)
//       setFetchError(null) // Clear any previous errors before a new fetch
//       try {
//         const data = await getContests()
//         setContests(data)
//         setFilteredContests(data) // Initialize filtered contests with all fetched contests
//       } catch (error) {
//         console.error("Error loading contests:", error)
//         setFetchError("Failed to load contests. Please try again later.")
//         setContests([]) // Clear contests on error
//         setFilteredContests([]) // Clear filtered contests on error
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadContests()
//   }, []) // Empty dependency array means this effect runs once after the initial render

//   // Filter contests - this useEffect remains largely the same as its logic is based on local state
//   useEffect(() => {
//     let filtered = contests

//     // Search filter
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(
//         (contest) =>
//           contest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           contest.platform.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     }

//   // Platform filter
//   if (selectedPlatforms.length > 0) {
//   const knownPlatforms = ["Codeforces", "LeetCode", "CodeChef", "AtCoder", "HackerRank", "TopCoder"];

//   filtered = filtered.filter((contest) => {
//     const isKnown = knownPlatforms.includes(contest.platform);
//     const isSelected = selectedPlatforms.includes(contest.platform);
//     const isOtherSelected = selectedPlatforms.includes("Others");

//     // Include if:
//     // - It is in selected platforms (like LeetCode, Codeforces etc.)
//     // - OR it is not a known platform and "Others" is selected
//     return isSelected || (isOtherSelected && !isKnown);
//   });
// }

//     // Difficulty filter
//     if (selectedDifficulties.length > 0) {
//       filtered = filtered.filter((contest) => selectedDifficulties.includes(contest.difficulty))
//     }

//     // Status filter
//     if (selectedStatuses.length > 0) {
//       filtered = filtered.filter((contest) => selectedStatuses.includes(contest.status))
//     }

//     setFilteredContests(filtered)
//     setCurrentPage(1) // Reset to first page whenever filters change
//   }, [contests, searchQuery, selectedPlatforms, selectedDifficulties, selectedStatuses]) // Dependencies for filtering

//   // Pagination logic
//   const totalPages = Math.ceil(filteredContests.length / itemsPerPage)
//   const startIndex = (currentPage - 1) * itemsPerPage
//   const currentContests = filteredContests.slice(startIndex, startIndex + itemsPerPage)

//   return (
//     <div className="min-h-screen bg-[#F9FAFB]">
//       <Navbar />

//       <HeroSection
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         onFilterToggle={() => setIsMobileFilterOpen(true)}
//       />

//       <div className="flex">
//         {/* Desktop Filter Sidebar */}
//         <div className="hidden lg:block">
//           <FilterSidebar
//             selectedPlatforms={selectedPlatforms}
//             selectedDifficulties={selectedDifficulties}
//             selectedStatuses={selectedStatuses}
//             onPlatformsChange={setSelectedPlatforms}
//             onDifficultiesChange={setSelectedDifficulties}
//             onStatusesChange={setSelectedStatuses}
//           />
//         </div>

//         {/* Mobile Filter Sidebar */}
//         {isMobileFilterOpen && (
//           <>
//             {/* Overlay for mobile filter */}
//             <div
//               className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//               onClick={() => setIsMobileFilterOpen(false)}
//             />
//             {/* Mobile Filter Sidebar content */}
//             <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
//               <FilterSidebar
//                 selectedPlatforms={selectedPlatforms}
//                 selectedDifficulties={selectedDifficulties}
//                 selectedStatuses={selectedStatuses}
//                 onPlatformsChange={setSelectedPlatforms}
//                 onDifficultiesChange={setSelectedDifficulties}
//                 onStatusesChange={setSelectedStatuses}
//                 onClose={() => setIsMobileFilterOpen(false)} // Pass onClose for mobile
//               />
//             </div>
//           </>
//         )}

//         <div className="flex-1">
//           {/* Display fetch error message if any */}
//           {fetchError && (
//             <div className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md text-center mx-4 my-4">
//               {fetchError}
//             </div>
//           )}

//           {/* Contest Grid */}
//           <ContestGrid contests={currentContests} loading={loading} totalCount={filteredContests.length} />

//           {/* Show pagination only when not loading, no error, and there's more than one page */}
//           {!loading && !fetchError && totalPages > 1 && (
//             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
