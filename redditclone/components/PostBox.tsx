// components/PostBox.tsx
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import { getSubredditByTopic, addSubreddit } from "../services/subredditService";
import { addPost } from "../services/postService";

type FormData = {
  postTitle: string;
  postBody?: string;
  postImage?: string;
  subreddit?: string;
};

type Props = {
  defaultSubreddit?: string;
  onPostCreated?: () => void;
  refresh?: number;
};

export default function PostBox({ defaultSubreddit, onPostCreated, refresh }: Props) {
  const { data: session } = useSession();
  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  const [imageBoxOpen, setImageBoxOpen] = useState(false);

  const title = watch("postTitle");

  const onSubmit = async (form: FormData) => {
    if (!session?.user?.name) {
      toast.error("Please sign in to post");
      return;
    }
    const notification = toast.loading("Creating post...");
    try {
      const rawTopic = (form.subreddit ?? defaultSubreddit ?? "").trim();
      const topic = rawTopic.replace(/^\/+/, "");
      if (!topic) {
        toast.error("Subreddit required", { id: notification });
        return;
      }

      const { data: existing, error: e } = await getSubredditByTopic(topic);
      if (e) throw e;

      let subId: number;
      if (!existing || existing.length === 0) {
        const { data: newSub, error: addErr } = await addSubreddit(topic);
        if (addErr) throw addErr;
        subId = newSub!.id;
      } else subId = existing[0].id;

      const { data, error } = await addPost({
        title: form.postTitle,
        body: form.postBody ?? "",
        image: form.postImage ?? "",
        subreddit_id: subId,
        username: session.user.name ?? "unknown",
      });

      if (error) throw error;
      toast.success("Post created!", { id: notification });
      setValue("postTitle", "");
      setValue("postBody", "");
      setValue("postImage", "");
      setValue("subreddit", "");
      onPostCreated?.();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create post", { id: notification });
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-md border border-gray-300 bg-white p-3 mb-3">
      <div className="flex items-center space-x-3">
        <Avatar />
        <input {...register("postTitle", { required: true })} disabled={!session} className="flex-1 rounded-md bg-gray-50 p-2" placeholder={session ? "Create a post" : "Sign in to post"} />
      </div>

      {!!title && (
        <div className="mt-3 flex flex-col space-y-2">
          <input {...register("postBody")} className="bg-gray-50 p-2" placeholder="Text (optional)" />
          <input {...register("subreddit")} defaultValue={defaultSubreddit ?? ""} className="bg-gray-50 p-2" placeholder="Subreddit (e.g. reactjs)" />
          <div>
            <button type="button" onClick={() => setImageBoxOpen((s) => !s)} className="text-sm text-blue-500 mb-2">{imageBoxOpen ? "Hide" : "Add image"}</button>
          </div>
          {imageBoxOpen && <input {...register("postImage")} className="bg-gray-50 p-2" placeholder="Image URL" />}
          <button type="submit" className="w-full rounded-full p-2 bg-blue-600 text-white">Create Post</button>
        </div>
      )}
    </form>
  );
}
