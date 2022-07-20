import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MODIFY_COMMENT } from "../../../graphql/mutations";
import { GET_COMMENT_BY__COMMENT_ID, GET_POSTS_BY_POST_ID } from "../../../graphql/queries";

type FormData = {
  comment:string;
};

const EditComment = () => {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();

  const [modifyComment] = useMutation(MODIFY_COMMENT,{
    refetchQueries:[GET_POSTS_BY_POST_ID,"getPost"]
  });

  const commentChecker = (comment:any) => {
    if (!comment || comment.length == 0) return false;
    else {
      let invalidComment = false;
      for (let i = 0; i < comment.length; i++) {
        if (comment[i] != " ") invalidComment = true;
      }
      return invalidComment;
    }
  };

  // Fetch Comment using gql query
  const {loading,error,data} = useQuery(GET_COMMENT_BY__COMMENT_ID,{
    variables:{
        id:router.query.commentId,
    },
  });
  setValue("comment", data?.getComment?.text);
  const post_id = data?.getComment?.post_id;
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // post comment here
    // console.log(data);
    if (commentChecker(data.comment)) {
      const notification = toast.loading("Changing your comment");
      const dataFromgql = await modifyComment({
        variables: {
          id: router.query.commentId,
          text: data.comment,
        },
      });
      setValue("comment", "");
      toast.success("Comment Successfully Modified!", {
        id: notification,
      });
      // console.log(dataFromgql);
      router.push(`/post/${post_id}`)
    } else {
      toast("Can't post an empty comment, try deleting it.");
      return;
    }
  };

  if (session?.user?.name === data?.getComment.username){
        return (
          <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
            <p className="text-sm">
              Editing your comment as{" "}
              <span className="text-red-500">{session?.user?.name}</span>
            </p>
            <form
              className="flex flex-col space-y-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <textarea
                {...register("comment")}
                disabled={!session}
                className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
              />
              <button
                type="submit"
                className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
              >
                Finish Editing Comment
              </button>
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

export default EditComment;
