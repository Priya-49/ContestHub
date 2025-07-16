import type { Contest } from "@/types/contest";

interface ClistApiContest {
  id: number;
  resource: string;
  event: string;
  start: string; // ISO 8601 string
  end: string;   // ISO 8601 string
  duration: number; // in seconds
  host: string;
  href: string; // This is the URL from Clist
  n_problems: number | null;
}

const getPlatformDetails = (resourceName: string) => {
  const resource = resourceName.toLowerCase();

  if (resource.includes("codeforces")) return { name: "Codeforces", logo: "/images/codeforces.png" };
  if (resource.includes("leetcode")) return { name: "LeetCode", logo: "/images/leetcode.svg" };
  if (resource.includes("codechef")) return { name: "CodeChef", logo: "/images/codechef.svg" };
  if (resource.includes("atcoder")) return { name: "AtCoder", logo: "/images/atcoder.png" };
  if (resource.includes("naukri")) return { name: "Naukri", logo: "/images/naukri.png" };
  if (resource.includes("geeksforgeeks")) return { name: "GeeksforGeeks", logo: "/images/gfg.png" };
  if (resource.includes("kaggle")) return { name: "Kaggle", logo: "/images/kaggle.jpg" };
  if (resource.includes("algotester")) return { name: "Algoster", logo: "/images/algotester.png" };
  const fallbackName = resourceName.split('.')[0] || "Other";
  return { name: fallbackName, logo: "/images/generic.jpg" };
};

const difficultyRules = [
  { platform: "AtCoder", keywords: "beginner", difficulty: "Beginner" },
  { platform: "AtCoder", keywords: "regular", difficulty: "Medium" },
  { platform: "AtCoder", keywords: "grand", difficulty: "Hard" },

  { platform: "LeetCode", keywords: "weekly", difficulty: "Easy" },
  { platform: "LeetCode", keywords: "biweekly", difficulty: "Medium" },

  { platform: "Codeforces", keywords: ["div. 3", "div3"], difficulty: "Easy" },
  { platform: "Codeforces", keywords: ["div. 2", "div2"], difficulty: "Medium" },
  { platform: "Codeforces", keywords: ["div. 1", "div1"], difficulty: "Hard" },
  { platform: "Codeforces", keywords: "global", difficulty: "Hard" },

  { platform: "CodeChef", keywords: "starters", difficulty: "Beginner" },
  { platform: "CodeChef", keywords: "lunchtime", difficulty: "Easy" },
  { platform: "CodeChef", keywords: ["cook-off", "cookoff"], difficulty: "Medium" },
  { platform: "CodeChef", keywords: ["long challenge", " rated"], difficulty: "Hard" },

  { platform: "TopCoder", keywords: "srm", difficulty: "Hard" },
];

const inferDifficulty = (platform: string, contestName: string): Contest["difficulty"] => {
  const lowerName = contestName.toLowerCase();

  for (const rule of difficultyRules) {
    if (rule.platform === platform) {
      const keywords = Array.isArray(rule.keywords) ? rule.keywords : [rule.keywords];
      if (keywords.some(keyword => lowerName.includes(keyword.toLowerCase()))) {
        return rule.difficulty;
      }
    }
  }

  return "Medium";
};

const formatDuration = (seconds: number): string => {
  if (seconds === 0) return "0 minutes";

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return days === 1 ? "1 day" : `${days} days`;

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  const parts: string[] = [];

  if (remainingHours > 0) {
    parts.push(remainingHours === 1 ? "1 hour" : `${remainingHours} hours`);
  }

  if (remainingMinutes > 0) {
    parts.push(remainingMinutes === 1 ? "1 minute" : `${remainingMinutes} minutes`);
  }

  return parts.length ? parts.join(" ") : "0 minutes";
};

const getContestStatus = (
  start: string,
  end: string,
  durationSec: number
): Contest["status"] => {
  const now = new Date();
  const startTime = new Date(start);
  const endTime = new Date(end);

  if (now > endTime) return "ended";
  if (now >= startTime && now <= endTime) {
    return durationSec / 3600 > 24 ? "ongoing" : "live";
  }
  return "upcoming";
};

const getStatusSortOrder = (status: Contest["status"]): number => {
  switch (status) {
    case "upcoming": return 1;
    case "live": return 2;
    case "ongoing": return 3;
    case "ended": return 4;
    default: return 5;
  }
};

const isHiringChallengeContest = (contestName: string, platformName: string): boolean => {
  const lowerName = contestName.toLowerCase();
  const lowerPlatform = platformName.toLowerCase();

  const hiringKeywords = [
    "hiring challenge", "hiring test", "recruitment challenge", "interview contest",
    "job-a-thon", "placement drive", "codeathon for job", "code 360",
    "assessment", "screening test"
  ];

  const hasHiringKeyword = hiringKeywords.some(keyword => lowerName.includes(keyword));

  const isPlatformSpecificHiring = lowerPlatform.includes("naukri") && hasHiringKeyword;

  return hasHiringKeyword || isPlatformSpecificHiring;
};

export async function getContests(): Promise<Contest[]> {
  try {
    const CLIST_API_KEY = process.env.NEXT_PUBLIC_CLIST_API_KEY;
    const CLIST_USERNAME = process.env.NEXT_PUBLIC_CLIST_USERNAME;

    if (!CLIST_API_KEY || !CLIST_USERNAME) {
      console.error("CLIST credentials are missing.");
      return [];
    }

    const url = `https://clist.by/api/v4/contest/?username=${CLIST_USERNAME}&api_key=${CLIST_API_KEY}&order_by=start&format=json&end__gt=${new Date().toISOString()}&limit=150`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch contests: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const contestsFromApi: ClistApiContest[] = data.objects;

    const processedContests: Contest[] = contestsFromApi.map(contest => {
      const platform = getPlatformDetails(contest.resource);
      const duration = formatDuration(contest.duration);
      const status = getContestStatus(contest.start, contest.end, contest.duration);
      const difficulty = inferDifficulty(platform.name, contest.event);
      const isHiringChallenge = isHiringChallengeContest(contest.event, platform.name);

     
      let contestUrl = contest.href;
      if (contestUrl && !(contestUrl.startsWith('http://') || contestUrl.startsWith('https://'))) {
        contestUrl = `https://${contestUrl}`; // Default to https if protocol is missing
      }
      if (!contestUrl) {
         contestUrl = '#'; // Fallback for genuinely empty or null URLs, though Clist usually provides
      }
      

      return {
        id: contest.id,
        platform: platform.name,
        platformLogo: platform.logo,
        name: contest.event,
        startTime: contest.start,
        duration,
        difficulty,
        status,
        url: contestUrl, // Use the normalized URL
        problems: contest.n_problems ?? 0,
        isHiringChallenge,
      };
    });

    const sortedContests = processedContests.sort((a, b) => {
      const statusOrderA = getStatusSortOrder(a.status);
      const statusOrderB = getStatusSortOrder(b.status);

      if (statusOrderA !== statusOrderB) {
        return statusOrderA - statusOrderB;
      }

      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return sortedContests;

  } catch (error) {
    console.error("Error fetching contests from Clist:", error);
    return [];
  }
}