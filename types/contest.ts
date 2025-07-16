export type Contest = {
  id: number
  platform: string
  platformLogo: string
  name: string
  startTime: string
  duration: string
  difficulty: string
  problems: number
  url: string 
  status: "upcoming" | "live" | "ongoing" | "ended"
  isHiringChallenge?: boolean
}

export type FilterState = {
  platforms: string[]
  difficulties: string[]
  durations: string[]
  statuses: string[]
  searchQuery: string
}

export type PaginationState = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}