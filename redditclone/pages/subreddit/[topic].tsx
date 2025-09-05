// pages/subreddit/[topic].tsx
import { useRouter } from "next/router";
import Feed from "../../components/Feed";
import PostBox from "../../components/PostBox";

const clean = (t?: string) => (t ?? "").replace(/^\/+/, "").trim();

export default function SubredditPage() {
  const router = useRouter();
  const topic = clean(router.query.topic as string | undefined);

  return (
    <div className="max-w-5xl mx-auto my-7">
      <div className="mb-4 -mx-8 bg-white p-6 rounded">
        <h1 className="text-3xl font-semibold">r/{topic}</h1>
        <p className="text-sm text-gray-400">r/{topic}</p>
      </div>

      <div className="mx-auto max-w-5xl mt-5 pb-10">
        <PostBox defaultSubreddit={topic} onPostCreated={() => { /* feed hook will refetch automatically */ }} />
        <Feed topic={topic} />
      </div>
    </div>
  );
}
