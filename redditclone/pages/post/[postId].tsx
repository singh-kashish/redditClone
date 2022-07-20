import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Post from "../../components/Post";
import { GET_POSTS_BY_POST_ID } from "../../graphql/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { ADD_COMMENT, DELETE_COMMENT } from "../../graphql/mutations";
import toast from "react-hot-toast";
import Avatar from "../../components/Avatar";
import ReactTimeago from "react-timeago";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import Modal from "react-modal";

const PostPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POSTS_BY_POST_ID, "getPost"],
  });
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: [GET_POSTS_BY_POST_ID, "getPost"],
  });

  const { loading, error, data } = useQuery(GET_POSTS_BY_POST_ID, {
    variables: {
      id: router.query.postId,
    },
  });

  const post: Post = data?.getPost;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const commentChecker = (comment) => {
    if (!comment || comment.length == 0) return false;
    else {
      let invalidComment = false;
      for (let i = 0; i < comment.length; i++) {
        if (comment[i] != " ") invalidComment = true;
      }
      return invalidComment;
    }
  };
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // post comment here
    // console.log(data);
    if (commentChecker(data.comment)) {
      const notification = toast.loading("Posting your comment");
      const dataFromgql = await addComment({
        variables: {
          post_id: router.query.postId,
          username: session?.user?.name,
          text: data.comment,
        },
      });
      setValue("comment", "");
      toast.success("Comment Successfully Posted!", {
        id: notification,
      });
      // console.log(dataFromgql);
    } else {
      toast("Can't post an empty comment!");
      return;
    }
  };
  const deleteThisComment = async (id, username) => {
    setModalIsOpen(true);
    if (session?.user?.name === username) {
      const deletedData = await deleteComment({
        variables: {
          id: id,
        },
      });
      setModalIsOpen(false);
      toast("This comment was deleted !");
      router.push(`/post/${post.id}`);
    } else {
      setModalIsOpen(false);
      toast(
        "This comment wasn't made by you, so you don't have the permissions to delete it"
      );
      router.push("/");
    }
  };

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />

      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>
        <form
          className="flex flex-col space-y-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <textarea
            {...register("comment")}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
            placeholder={
              session ? "What are your thoughts?" : "Please sign in to comment"
            }
          />
          <button
            type="submit"
            className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>
      <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10">
        <hr className="py-2" />
        {post?.commentList.map((comment) => (
          <div
            key={comment.id}
            className="relative flex items-center space-x-2 space-y-5"
          >
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              style={{
                overlay: {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  zIndex:"100",
                },
                content: {
                  position: "absolute",
                  top: "200px",
                  left: "450px",
                  right: "450px",
                  bottom: "250px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  overflow: "auto",
                  WebkitOverflowScrolling: "touch",
                  borderRadius: "4px",
                  outline: "none",
                  padding: "45px",
                  zIndex:"100",
                },
              }}
            >
              <div className="flex flex-col items-center justify-center mt-11">
                <p className="text-xl">
                  Are you sure you want to delete this comment?
                </p>

                <div className="flex flex-row justify-evenly mt-2">
                  <button
                    className="w-14 h-7 bg-teal-400 rounded-full mr-4 text-white"
                    onClick={() =>
                      deleteThisComment(comment.id, comment.username)
                    }
                  >
                    Yes
                  </button>
                  <button
                    className="w-14 h-7 bg-blue-700 rounded-full text-white"
                    onClick={() => {
                      setModalIsOpen(false);
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </Modal>
            <hr className="absolute top-10 h-16 border left-7 z-0" />
            <div className="z-50">
              <Avatar seed={comment.username} />
            </div>

            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-600">
                  {comment.username}
                </span>{" "}
                <ReactTimeago date={comment.created_at} />
              </p>

              <p>{comment.text}</p>
            </div>
            
            <div
              className="postButtons absolute inset-y-0 right-0"
              onClick={() => {
                if(session?.user?.name===comment.username){router.push(`/comment/edit/${comment.id}`);}
                else toast("You aren't the author of this comment!");
              }}
            >
              <PencilIcon className="h-4 w-4" />
              <p className="hidden sm:inline">Edit</p>
            </div>

            <div
              className="postButtons absolute absolute right-14 inset-y-0"
              onClick={() => setModalIsOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              <p className="hidden sm:inline">Delete</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
