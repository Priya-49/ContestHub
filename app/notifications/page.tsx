// app/notifications/page.tsx
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import NotificationCard from "@/components/NotificationCard"

type Notification = {
  _id: string
  contestName: string
  contestDate: string
  contestTime: string
  contestUrl: string
  notifyBefore: string
  platform?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const handleNotificationUpdate = (updatedNote: { _id: string; notifyBefore: string }) => {
    setNotifications((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id
          ? { ...note, notifyBefore: updatedNote.notifyBefore }
          : note
      )
    )
  }

  const handleNotificationDelete = (deletedId: string) => {
    setNotifications((prevNotes) => prevNotes.filter((note) => note._id !== deletedId))
    toast.success("Notification removed.")
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setNotifications(data)
      } catch {
        toast.error("Failed to load notifications")
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  if (loading) {
    return <p className="text-center py-10 text-gray-600">Loading notifications...</p>
  }

  if (notifications.length === 0) {
    return <p className="text-center py-10 text-gray-500">No contests notified yet.</p>
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">Your Contest Notifications</h1>
        <p className="text-gray-600 text-sm">Manage the contests you&apos;ve set reminders for</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications.map((note) => (
          <NotificationCard
            key={note._id}
            id={note._id}
            contestName={note.contestName}
            contestDate={note.contestDate}
            contestTime={note.contestTime || "Ongoing"}
            contestUrl={note.contestUrl}
            notifyBefore={note.notifyBefore}
            platform={note.platform || "Unknown"}
            onUpdate={handleNotificationUpdate}
            onDelete={handleNotificationDelete}
          />
        ))}
      </div>
    </div>
  )
}
