// pages/comment/edit.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useComment } from "../../../hooks/useComment";
import { modifyComment } from "../../../services/commentService";

type FormData = { comment: string };

export default function EditComment() {
  const { data: session } = useSession();
  const router = useRouter();
  console.log('router',router.query);
  const idNum = Number(router.query.commentId);
  console.log('idNum',idNum);
  const { comment, loading } = useComment(Number.isFinite(idNum) ? idNum : undefined);

  const { register, handleSubmit, setValue } = useForm<FormData>();

  useEffect(() => { if (comment?.text) setValue("comment", comment.text); }, [comment, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!comment?.id) return;
    if (!data.comment.trim()) { toast.error("Can't post empty"); return; }
    const n = toast.loading("Updating comment...");
    await modifyComment(comment.id, data.comment);
    toast.success("Comment updated", { id: n });
    router.push(`/post/${comment.post_id}`);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  if (session?.user?.name === comment?.username) {
    return (
      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm">Editing your comment as <span className="text-red-500">{session?.user?.name}</span></p>
        <form className="flex flex-col space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <textarea {...register("comment")} disabled={!session} className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50" />
          <button type="submit" className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200">Finish Editing Comment</button>
        </form>
      </div>
    );
  }

  return <div className="flex flex-1"><img className="min-w-full" src="https://www.elegantthemes.com/blog/wp-content/uploads/2019/12/401-error-wordpress-featured-image.jpg" alt="Unauthorized" /></div>;
}
