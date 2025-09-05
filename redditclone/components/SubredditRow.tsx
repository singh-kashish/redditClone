// components/SubredditRow.tsx
import React from "react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import Avatar from "./Avatar";
import Link from "next/link";

type Props = { topic: string; index: number };

const clean = (t: string) => t.trim().replace(/^\/+/, "");

export default function SubredditRow({ index, topic }: Props) {
  const safe = clean(topic);
  return (
    <div className="flex items-center space-x-2 border-t bg-white px-4 py-2 last:rounded-b">
      <p>{index + 1}</p>
      <ChevronUpIcon className="h-4 w-4 flex-shrink-0 text-green-400" />
      <Avatar seed={safe} />
      <p className="flex-1 truncate">r/{safe}</p>
      <Link href={`/subreddit/${encodeURIComponent(safe)}`}>
        <div className="cursor-pointer rounded-full bg-blue-500 px-3 text-white">View</div>
      </Link>
    </div>
  );
}
