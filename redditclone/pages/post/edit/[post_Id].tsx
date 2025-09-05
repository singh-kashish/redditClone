// pages/post/edit/[post_Id].tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Avatar from "../../../components/Avatar";
import { PhotographIcon, LinkIcon } from "@heroicons/react/outline";
import { Jelly } from "@uiball/loaders";
import { usePost } from "../../../hooks/usePost";
import { modifyPost } from "../../../services/postService";

type FormData = { postTitle: string; postBody: string; postImage: string; subreddit: string };

export default function EditPost() {
  const router = useRouter();
  const { data: session } = useSession();
  const postIdNum = Number(router.query.post_Id);
  const { post, loading } = usePost(Number.isFinite(postIdNum) ? postIdNum : undefined);

  const { register, setValue, handleSubmit, watch } = useForm<FormData>();

  useEffect(() => {
    if (post) {
      setValue("postBody", post.body);
      setValue("postImage", post.image);
      setValue("postTitle", post.title);
      setValue("subreddit", post.subreddit?.topic ?? "");
    }
  }, [post, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    if (!post?.id) return;
    const n = toast.loading("Updating post...");
    await modifyPost(post.id, { body: formData.postBody, image: formData.postImage || "", title: formData.postTitle });
    toast.dismiss(n);
    toast.success("Post updated!");
    router.push("/");
  };

  if (loading) return <div className="flex w-full items-center justify-center p-10 text-xl"><Jelly size={50} color="#FF4501" /></div>;

  if (session?.user?.name === post?.username) {
    return (
      <div className="mx-auto my-7 max-w-5xl">
        <form onSubmit={handleSubmit(onSubmit)} className="sticky top-20 z-50 bg-white border rounded-md border-gray-300 p-2">
          <div className="flex items-center space-x-3">
            <Avatar />
            <input {...register("postTitle", { required: true })} disabled={!session} className="flex-1 rounded-md bg-gray-50" type="text" />
            <PhotographIcon className="h-6 cursor-pointer text-gray-300" />
            <LinkIcon className="h-6 text-gray-300" />
          </div>
          {!!watch("postTitle") && (
            <div className="flex flex-col py-2">
              <div className="flex items-center px-2">
                <p className="min-w-[90px]">Body:</p>
                <input className="m-2 flex-1 bg-blue-50 p-2 outline-none" {...register("postBody")} type="text" />
              </div>
              <div className="flex items-center px-2">
                <p className="min-w-[90px]">Image URL:</p>
                <input className="m-2 flex-1 bg-blue-50 p-2 outline-none" {...register("postImage")} type="text" />
              </div>
              <button type="submit" className="w-full rounded-full p-2 bg-blue-600 text-white">Finish Editing Post</button>
            </div>
          )}
        </form>
      </div>
    );
  }

  return <div className="flex flex-1"><img className="min-w-full" src="https://www.elegantthemes.com/blog/wp-content/uploads/2019/12/401-error-wordpress-featured-image.jpg" alt="Unauthorized" /></div>;
}
