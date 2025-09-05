// components/CommentBox.tsx
import React from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addComment } from "../services/commentService";

type Props = { postId: number; onCommentAdded?: () => void };

export default function CommentBox({ postId, onCommentAdded }: Props) {
  const { data: session } = useSession();
  const { register, handleSubmit, setValue } = useForm<{ comment: string }>();

  const onSubmit = async (d: { comment: string }) => {
    if (!session?.user?.name) { toast.error("Sign in to comment"); return; }
    if (!d.comment.trim()) { toast.error("Can't post empty"); return; }
    const n = toast.loading("Posting comment...");
    const { error } = await addComment({ post_id: postId, username: session.user.name, text: d.comment });
    if (error) { toast.error("Failed", { id: n }); return; }
    toast.success("Comment posted", { id: n });
    setValue("comment", "");
    onCommentAdded?.();
  };

  return (
    <div className="rounded-md border border-gray-300 bg-white p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea {...register("comment")} className="w-full p-2 border rounded" placeholder={session ? "Write a comment..." : "Sign in to comment"} />
        <div className="flex justify-end mt-2">
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Comment</button>
        </div>
      </form>
    </div>
  );
}
