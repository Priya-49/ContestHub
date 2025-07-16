"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pagesInBlock = 3

  const getBlockPages = (current: number, total: number, blockSize: number) => {
    const pages: (number | string)[] = []
    const startBlock = Math.floor((current - 1) / blockSize)
    const startPageInBlock = startBlock * blockSize + 1

    for (let i = 0; i < blockSize; i++) {
      const pageNum = startPageInBlock + i
      if (pageNum <= total) {
        pages.push(pageNum)
      }
    }

    if (startPageInBlock + blockSize <= total) {
      pages.push("...")
    }

    return pages
  }

  const displayPages = getBlockPages(currentPage, totalPages, pagesInBlock)

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {displayPages.map((page, index) => (
            <span key={typeof page === "number" ? page : `ellipsis-${index}`}>
              {typeof page === "number" ? (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => onPageChange(page)}
                  className={
                    page === currentPage
                      ? "bg-black text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
                  }
                >
                  {page}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Calculate the start of the next block
                    const currentBlockStart = Math.floor((currentPage - 1) / pagesInBlock) * pagesInBlock + 1;
                    const nextBlockStart = currentBlockStart + pagesInBlock;
                    // Ensure we don't go beyond totalPages
                    onPageChange(Math.min(nextBlockStart, totalPages));
                  }}
                  className="text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
                >
                  ...
                </Button>
              )}
            </span>
          ))}

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>
    </div>
  )
}