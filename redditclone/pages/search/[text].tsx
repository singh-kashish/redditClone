import { useRouter } from "next/router";
import { useSearch } from "../../hooks/useSearch";
import Post from "../../components/Post";
import { DotSpinner } from "@uiball/loaders";

export default function SearchPage() {
  const router = useRouter();
  const text = typeof router.query.text === "string" ? router.query.text : "";

  // Only run search when router is ready and text is available
  const { results, loading } = useSearch(router.isReady ? text : "");

  return (
    <div className="max-w-5xl mx-auto my-7">
      <h1 className="text-2xl font-bold mb-4">Search results for "{text}"</h1>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <DotSpinner size={80} color="orange" />
          </div>
        ) : !results.length ? (
          <div className="p-4">No results found</div>
        ) : (
          results.map((p) => <Post key={p.id} post={p} />)
        )}
      </div>
    </div>
  );
}
