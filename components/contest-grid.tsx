import type { Contest } from "@/types/contest"
import ContestCard from "./contest-card"

type ContestGridProps = {
  contests: Contest[]
  loading: boolean
  totalCount: number
}

export default function ContestGrid({ contests, loading, totalCount }: ContestGridProps) {
  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading contests...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Coding Contests</h2>
          <p className="text-sm text-gray-600">{totalCount} contests found</p>
        </div>

        {contests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No contests found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {contests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
