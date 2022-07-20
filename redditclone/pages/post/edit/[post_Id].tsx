import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { GET_ALL_POSTS, GET_POSTS_BY_POST_ID } from "../../../graphql/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { MODIFY_POST } from "../../../graphql/mutations";
import toast from "react-hot-toast";
import Avatar from "../../../components/Avatar";
import ReactTimeago from "react-timeago";

import { PhotographIcon, LinkIcon } from "@heroicons/react/outline";
import { Jelly } from "@uiball/loaders";

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

type Props = {
  subreddit?: string;
};

const EditPost = () => {
  const Router = useRouter();

  const { data: session } = useSession();

  const { loading, error, data } = useQuery(GET_POSTS_BY_POST_ID, {
    variables: {
      id: Router.query.post_Id,
    },
  });
  const post: any = data?.getPost;
  // console.log(post);

  const [modifyPost] = useMutation(MODIFY_POST, {
    refetchQueries: [GET_ALL_POSTS, "getAllPosts"],
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue("postBody", post?.body);
    setValue("postImage", post?.image);
    setValue("postTitle", post?.title);
    setValue("subreddit", post?.subreddit?.topic);
    // console.log(post);
  }, [post]);

  const onSubmit = handleSubmit(async (formData) => {
    // console.log(formData);
    toast.loading("Setting the values for this post");
    
    // console.log("Creating post...", formData);
    const image = formData.postImage || "";
    const {
      data: { modifyPost: newPost },
    } = await modifyPost({
      variables: {
        id: post?.id,
        body: formData.postBody,
        image: image,
        title: formData.postTitle,
      },
    });
    toast("Post modified added:", newPost);
    toast.dismiss();
    Router.push("/");
  });

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    );
    if(session?.user?.name===post?.username){
        return (
          <div className="mx-auto my-7 max-w-5xl">
            <form
              onSubmit={onSubmit}
              className="sticky top-20 z-50 bg-white border rounded-md border-gray-300 p-2"
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <Avatar />
                <input
                  {...register("postTitle", { required: true })}
                  disabled={!session}
                  className="flex-1 rounded-md bg-gray-50"
                  type="text"
                />
                <PhotographIcon
                  className={`h-6 cursor-pointer text-gray-300
            text-blue-300"
            `}
                />
                <LinkIcon className={`h-6 text-gray-300`} />
              </div>
              {!!watch("postTitle") && (
                <div className="flex flex-col py-2">
                  <div className="flex items-center px-2">
                    <p className="min-w-[90px]">Body:</p>
                    <input
                      className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                      {...register("postBody")}
                      type="text"
                    />
                  </div>

                  {
                    <div className="flex items-center px-2">
                      <p className="min-w-[90px]">Image URL:</p>
                      <input
                        className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                        {...register("postImage")}
                        type="text"
                      />
                    </div>
                  }

                  <button
                    type="submit"
                    className="w-full rounded-full p-2 bg-blue-600 text-white"
                  >
                    Finish Editing Post
                  </button>
                </div>
              )}
            </form>
          </div>
        );
    }
    else{
      return (
        <div className="flex flex-1">
          <img
          className="min-w-full"
            src="https://www.elegantthemes.com/blog/wp-content/uploads/2019/12/401-error-wordpress-featured-image.jpg"
            alt="f"
          />
        </div>
      );
    }
  
};

export default EditPost;
