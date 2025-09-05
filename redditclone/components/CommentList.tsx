// components/CommentList.tsx
import React from "react";
import { Comment } from "../types/db";
import Avatar from "./Avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { deleteComment } from "../services/commentService";
import toast from "react-hot-toast";
import TimeAgo from "react-timeago";

type Props = { comments: Comment[]; onDeleted?: () => void };

export default function CommentList({ comments, onDeleted }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const doDelete = async (id: number, username: string) => {
    if (session?.user?.name !== username) { toast.error("You can't delete this"); return; }
    await deleteComment(id);
    toast.success("Deleted");
    onDeleted?.();
  };

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="flex space-x-3 items-start bg-white p-3 border rounded">
          <Avatar seed={c.username} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{c.username}</div>
              <div className="text-xs text-gray-500"><TimeAgo date={c.created_at} /></div>
            </div>
            <div className="mt-2">{c.text}</div>
            <div className="mt-2 flex space-x-2">
              <button onClick={() => router.push(`/comment/edit?commentId=${c.id}`)} className="text-xs text-blue-500">Edit</button>
              <button onClick={() => doDelete(c.id, c.username)} className="text-xs text-red-500">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
