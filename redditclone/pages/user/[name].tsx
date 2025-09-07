import { DotSpinner } from "@uiball/loaders";
import { useRouter } from "next/router";
import { usePostsByUsername } from "../../hooks/usePostsByUsername";
import Post from "../../components/Post";
export default function UserPage() {
    const router = useRouter();
    const userName = typeof router.query.name === "string" ? router.query.name : "";
    const isReady = router.isReady && !!userName;
    const { posts, loading, error, refetch } = usePostsByUsername(isReady ? userName : "");
    
  
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
            posts.map((p) => <Post key={p.id} post={p} />)
            )}
        </div>
      </div>
    );
}
