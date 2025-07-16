import { useEffect, useState } from "react"
import { getContests } from "@/data/contests"
import type { Contest } from "@/types/contest"

export default function useContests() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const data = await getContests()
        setContests(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load contests.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
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
  }
}
