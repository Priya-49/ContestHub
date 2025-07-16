"use client"

import { useState } from "react" 
import { Calendar, Clock, Bell, ExternalLink, Edit3, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

type Props = {
  id: string
  contestName: string
  contestDate: string 
  contestTime: string 
  contestUrl: string
  notifyBefore: string
  platform: string
  onUpdate: (updatedNote: { _id: string; notifyBefore: string }) => void
  onDelete: (deletedId: string) => void
}

export default function NotificationCard({
  id,
  contestName,
  contestDate,
  contestTime,
  contestUrl,
  notifyBefore,
  platform,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [currentNotifyBefore, setCurrentNotifyBefore] = useState(notifyBefore)
  const [tempNotifyBefore, setTempNotifyBefore] = useState(notifyBefore)

  const notificationOptions = [
    { value: "24h", label: "24h before" },
    { value: "12h", label: "12h before" },
    { value: "6h", label: "6h before" },
    { value: "3h", label: "3h before" },
    { value: "2h", label: "2h before" },
    { value: "1h", label: "1h before" },
    { value: "30m", label: "30m before" },
    { value: "15m", label: "15m before" },
    { value: "10m", label: "10m before" },
  ]

  const getNotificationLabel = (value: string) =>
    notificationOptions.find((opt) => opt.value === value)?.label || "1h before"

  const handleSave = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          notifyBefore: tempNotifyBefore,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setCurrentNotifyBefore(tempNotifyBefore)
        onUpdate({ _id: id, notifyBefore: tempNotifyBefore })
        toast.success(data.message || "Notification preference updated!")
        setEditing(false)
      } else {
        toast.error(data.message || "Failed to update notification preference.")
      }
    } catch (error) {
      console.error("Error updating notification:", error)
      toast.error("An error occurred while saving preference.")
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove this notification?")) {
      return;
    }
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      })

      const data = await res.json()

      if (res.ok) {
        onDelete(id)
        toast.success(data.message || "Notification removed!")
      } else {
        toast.error(data.message || "Failed to remove notification.")
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("An error occurred while removing notification.")
    }
  }

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-lg h-full flex flex-col justify-between relative">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Remove notification"
      >
        <X className="h-4 w-4" />
      </button>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-black leading-tight line-clamp-2 h-12">
          {contestName}
        </CardTitle>
        <p className="text-sm text-gray-600">{platform}</p>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-3 text-sm"> 
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">{contestDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">{contestTime}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Notify</span>
            </div>

            {!editing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTempNotifyBefore(currentNotifyBefore)
                  setEditing(true)
                }}
                className="h-7 px-2 text-gray-600 hover:text-black hover:bg-gray-100"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            )}
          </div>

          {editing ? (
            <div className="flex items-center space-x-2">
              <Select value={tempNotifyBefore} onValueChange={setTempNotifyBefore}>
                <SelectTrigger className="w-full h-8 text-sm border-gray-300 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {notificationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex space-x-1">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-8 w-8 p-0 bg-black text-white hover:bg-gray-800"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="h-8 w-8 p-0 border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border">
              {getNotificationLabel(currentNotifyBefore)}
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gray-300 text-white bg-black"
            onClick={() => window.open(contestUrl, "_blank")}
          >
            Go to Contest
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}