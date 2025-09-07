import { DotSpinner } from "@uiball/loaders";
import { useRouter } from "next/router";
import { usePostsByUsername } from "../../hooks/usePostsByUsername";
import Post from "../../components/Post";
import { ChevronDoubleUpIcon } from "@heroicons/react/solid";
export default function UserPage() {
    const router = useRouter();
    const userName = typeof router.query.name === "string" ? router.query.name : "";
    const isReady = router.isReady && !!userName;
    const { posts, loading, error, refetch } = usePostsByUsername(isReady ? userName : "");
    const handleGoToTop = () => {
      const root = document.getElementById("root");
      if (root) {
        root.scrollTo({ top: 0, behavior: "smooth" });
      }
    };  
  
    return (
      <div className="max-w-5xl mx-auto my-7">
        <h1 className="text-2xl font-bold mb-4">Posts by "{userName}"</h1>
        <div className="space-y-4">
        {!isReady ? (
            <div className="p-4">Loading...</div>
            ) : loading ? (
            <div className="flex items-center justify-center">
                <DotSpinner size={80} color="orange" />
            </div>
            ) : error ? (
            <div className="p-4 text-red-500">Error: {error.message || "An error occurred"}</div>
            ) : !posts.length ? (
            <div className="p-4">No posts found</div>
            ) : (
            <div>{(posts.map((p) => <Post key={p.id} post={p} />)
            )}
            <div className="flex justify-center my-8">
          <button
            onClick={handleGoToTop}
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Go to Top
            <ChevronDoubleUpIcon className="h-5 w-5 inline-block ml-2" />
          </button>
        </div>
            </div>
            )}
        </div>
      </div>
    );
}
