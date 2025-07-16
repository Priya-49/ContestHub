// components/ContestCard.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, ListChecks, Trophy, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type Contest = {
  id: number;
  platform: string;
  platformLogo: string;
  name: string;
  startTime: string;
  duration: string;
  difficulty: string;
  problems?: number;
  status: "upcoming" | "live" | "ongoing" | "ended";
  url: string;
  isHiringChallenge?: boolean;
};

type ContestCardProps = {
  contest: Contest;
};

export default function ContestCard({ contest }: ContestCardProps) {
  const { data: session, status } = useSession();
  const [isNotified, setIsNotified] = useState(false);
  const [isLoadingNotificationStatus, setIsLoadingNotificationStatus] = useState(true);

  const isAuthenticated = useMemo(
    () => status === "authenticated" && !!session?.user?.email,
    [status, session]
  );
  const userEmail = useMemo(() => session?.user?.email || "", [session]);

  useEffect(() => {
    const checkInitialNotificationStatus = async () => {
      if (!isAuthenticated || contest.status !== "upcoming") {
        setIsNotified(false);
        setIsLoadingNotificationStatus(false);
        return;
      }

      try {
        setIsLoadingNotificationStatus(true);
        const response = await fetch(
          `/api/notifications?contestId=${contest.id}&userEmail=${userEmail}`
        );

        if (response.ok) {
          const data = await response.json();
          setIsNotified(data.isNotified);
        }
      } finally {
        setIsLoadingNotificationStatus(false);
      }
    };

    checkInitialNotificationStatus();
  }, [isAuthenticated, contest.id, userEmail, contest.status]);

  const handleNotifyClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to enable notifications.");
      return;
    }

    if (contest.status !== "upcoming") {
      toast.info("Notifications can only be set for upcoming contests.");
      return;
    }

    if (isNotified) return;

    toast.success(`You're now notified for "${contest.name}"`);
    setIsNotified(true);

const contestDateTime = new Date(contest.startTime + "Z");
const formattedContestDate = contestDateTime.toLocaleString("en-US", {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formattedContestTime = contestDateTime.toLocaleString("en-US", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h12",
});


    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userEmail,
          contestId: contest.id,
          contestName: contest.name,
          contestUrl: contest.url,
          platform: contest.platform,
          contestDate: formattedContestDate,
          contestTime: formattedContestTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status !== 409) {
          setIsNotified(false);
        }
        toast.error(errorData.message || "Failed to save notification. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred while saving notification.");
      setIsNotified(false);
    }
  };

  const getStatusColor = useMemo(() => {
    return (statusString: string) => {
      switch (statusString) {
        case "live":
          return "bg-red-100 text-red-800 border-red-200";
        case "upcoming":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "ongoing":
          return "bg-green-100 text-green-800 border-green-200";
        case "ended":
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };
  }, []);

  const getDifficultyColor = useMemo(() => {
    return (difficulty: string) => {
      switch (difficulty.toLowerCase()) {
        case "beginner":
        case "easy":
          return "bg-green-50 text-green-700 border-green-200";
        case "medium":
          return "bg-yellow-50 text-yellow-700 border-yellow-200";
        case "hard":
          return "bg-orange-50 text-orange-700 border-orange-200";
        case "expert":
          return "bg-red-50 text-red-700 border-red-700";
        default:
          return "bg-gray-50 text-gray-700 border-gray-200";
      }
    };
  }, []);

  const formattedStartTimeForDisplay = useMemo(() => {
  const date = new Date(contest.startTime + "Z");
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    hourCycle: "h12",
    minute: "2-digit",
  });
}, [contest.startTime]);

  const shouldDisableButton = useMemo(() => {
    const isContestNotUpcoming =
      contest.status === "ongoing" ||
      contest.status === "ended" ||
      contest.status === "live";
    return (
      (isAuthenticated && isNotified) ||
      isLoadingNotificationStatus ||
      isContestNotUpcoming
    );
  }, [isAuthenticated, isNotified, isLoadingNotificationStatus, contest.status]);

  return (
    <Card className="rounded-xl border border-gray-100 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="pb-0.5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={contest.platformLogo}
              alt={`${contest.platform} logo`}
              width={32}
              height={32}
              className="h-8 w-8 rounded border border-gray-100 bg-white p-1 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">{contest.platform}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              className={`border text-xs font-medium ${getStatusColor(contest.status)}`}
            >
              {contest.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <h3 className="h-12 line-clamp-2 text-lg font-semibold leading-snug text-gray-900">
          {contest.name}
        </h3>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formattedStartTimeForDisplay}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{contest.duration}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ListChecks className="h-4 w-4" />
          <span>{contest.problems ?? "N/A"} problems</span>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-gray-600" />
          <Badge
            className={`border text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}
          >
            {contest.difficulty}
          </Badge>
          {contest.isHiringChallenge && (
            <Badge className="border border-teal-200 bg-teal-100 text-xs font-medium text-teal-800">
              HIRING
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          asChild
          className="flex-1 bg-black text-white transition-colors hover:bg-gray-800"
        >
          <a href={contest.url} target="_blank" rel="noopener noreferrer">
            View Details
          </a>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={`border ${
            shouldDisableButton
              ? "cursor-not-allowed border-gray-400 bg-gray-100 text-gray-400"
              : "border-black bg-white text-black hover:bg-black hover:text-white"
          }`}
          onClick={handleNotifyClick}
          disabled={shouldDisableButton}
        >
          {isLoadingNotificationStatus ? (
            <span className="animate-spin text-gray-500">...</span>
          ) : (
            <Bell className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
