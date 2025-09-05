// pages/post/[post_id].tsx
import { useRouter } from "next/router";
import { Jelly } from "@uiball/loaders";
import { usePost } from "../../hooks/usePost";
import { useComments } from "../../hooks/useComments";
import CommentBox from "../../components/CommentBox";
import CommentList from "../../components/CommentList";

export default function PostPage() {
  const router = useRouter();
  const postIdNum = Number(router.query.post_id);

  const { post, loading: postLoading, refetch: refetchPost } = usePost(Number.isFinite(postIdNum) ? postIdNum : undefined);
  const { comments, loading: commentsLoading, refetch: refetchComments } = useComments(Number.isFinite(postIdNum) ? postIdNum : undefined);

  if (postLoading || commentsLoading) return <div className="flex w-full items-center justify-center p-10 text-xl"><Jelly size={50} color="#FF4501" /></div>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className="mx-auto my-7 max-w-5xl">
      {/* Post rendering: reuse existing Post component if you want */}
      <div className="rounded border bg-white p-4 mb-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-gray-700 mt-2">{post.body}</p>
      </div>

      <CommentBox postId={post.id} onCommentAdded={() => { refetchComments(); refetchPost(); }} />
      <CommentList comments={comments} onDeleted={() => { refetchComments(); refetchPost(); }} />
    </div>
  );
}
