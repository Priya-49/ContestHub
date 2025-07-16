import { useMemo } from "react"
import type { Contest } from "@/types/contest"

interface FilterParams {
  contests: Contest[]
  searchQuery: string
  selectedPlatforms: string[]
  selectedDifficulties: string[]
  selectedStatuses: string[]
}

export default function useFilteredContests({
  contests,
  searchQuery,
  selectedPlatforms,
  selectedDifficulties,
  selectedStatuses,
}: FilterParams): Contest[] {
  return useMemo(() => {
    let filtered = [...contests]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.platform.toLowerCase().includes(query)
      )
    }

    if (selectedPlatforms.length > 0) {
      const knownPlatforms = ["Codeforces", "LeetCode", "CodeChef", "AtCoder", "Naukri", "TopCoder"]

      filtered = filtered.filter((contest) => {
        const isKnown = knownPlatforms.includes(contest.platform)
        const isSelected = selectedPlatforms.includes(contest.platform)
        const isOtherSelected = selectedPlatforms.includes("Others")

        return isSelected || (isOtherSelected && !isKnown)
      })
    }

    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((c) => selectedDifficulties.includes(c.difficulty))
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((c) => selectedStatuses.includes(c.status))
    }

    return filtered
  }, [contests, searchQuery, selectedPlatforms, selectedDifficulties, selectedStatuses])
}
