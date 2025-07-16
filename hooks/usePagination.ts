import { useState, useMemo } from "react"
import type { Contest } from "@/types/contest"

export default function usePagination(contests: Contest[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = useMemo(() => {
    return Math.ceil(contests.length / itemsPerPage)
  }, [contests.length, itemsPerPage])

  const currentContests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return contests.slice(start, start + itemsPerPage)
  }, [currentPage, contests, itemsPerPage])

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentContests,
  }
}
