"use client";

import { useState, useEffect } from "react";
import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInSeconds,
} from "date-fns";

interface RelativeTimeProps {
  isoString: string;
}

function RelativeTime({ isoString }: RelativeTimeProps) {
  const [relativeTime, setRelativeTime] = useState<string>("");

  useEffect(() => {
    const getRelativeTimeString = (isoString: string): string => {
      const date = parseISO(isoString);
      const distance = formatDistanceToNowStrict(date, { addSuffix: true });

      const [value, unit] = distance.replace("about ", "").split(" ");

      if (unit === "seconds" || unit === "second") {
        return "just now";
      }

      switch (unit) {
        case "minute":
        case "minutes":
          return `${value} min${value === "1" ? "" : "s"} ago`;
        case "hour":
        case "hours":
          return `${value} hr${value === "1" ? "" : "s"} ago`;
        case "day":
        case "days":
          return Number.parseInt(value) <= 6
            ? `${value} day${value === "1" ? "" : "s"} ago`
            : distance;
        case "week":
        case "weeks":
          return Number.parseInt(value) <= 4
            ? `${value} week${value === "1" ? "" : "s"} ago`
            : distance;
        case "month":
        case "months":
          return Number.parseInt(value) <= 12
            ? `${value} month${value === "1" ? "" : "s"} ago`
            : distance;
        case "year":
        case "years":
          return `${value} year${value === "1" ? "" : "s"} ago`;
        default:
          return distance;
      }
    };

    const updateRelativeTime = () => {
      setRelativeTime(getRelativeTimeString(isoString));
    };

    // Initial update
    updateRelativeTime();

    // Determine the update interval based on how old the date is
    const date = parseISO(isoString);
    const secondsOld = differenceInSeconds(new Date(), date);
    let interval: number;

    if (secondsOld < 60) {
      // Update every second if less than a minute old
      interval = 1000;
    } else if (secondsOld < 3600) {
      // Update every minute if less than an hour old
      interval = 60000;
    } else {
      // Update every hour for older dates
      interval = 3600000;
    }

    const timer = setInterval(updateRelativeTime, interval);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, [isoString]);

  return <span className="text-sm text-gray-400">{relativeTime}</span>;
}

export default RelativeTime;
