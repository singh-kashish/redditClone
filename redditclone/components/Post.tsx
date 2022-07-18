import React, { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
  PencilIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";

import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { Jelly } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { GET_ALL_VOTES_BY_POST_ID } from "../graphql/queries";
import { ADD_VOTE, MODIFY_VOTE, REMOVE_VOTE } from "../graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";

type Props = {
  post: Post;
};

const Post = ({ post }: Props) => {
  const Router = useRouter();
  const [vote, setVote] = useState<boolean>();
  const [voteId, setVoteId] = useState<number>();
  const { data: session } = useSession();

  const { data, loading, error } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      id: post?.id,
    },
  });

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVotesByPostId"],
  });

  const [deleteVote] = useMutation(REMOVE_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVotesByPostId"],
  });

  const [modifyVote] = useMutation(MODIFY_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVotesByPostId"],
  });

  const upVote = async (typeOfVote: boolean) => {
    if (!session) {
      toast("Hey, You need to sign in to be able to vote!");
      return;
    }
    // UpVote exists , again hitting upvote removes your vote, thereby deleting it
    else if (vote && typeOfVote) {
      toast("Removing your Upvote!");
      const {
        data: { deleteVote: oldVote },
      } = await deleteVote({
        variables: {
          id: voteId,
        },
      });
      toast("Your vote was successfully removed!");

      return;
    }
    // DownVote exists, again hitting downvote removes your vote,thereby deleting it
    else if (vote === false && !typeOfVote) {
      toast("Removing your Downvote");
      const {
        data: { deleteVote: oldVote },
      } = await deleteVote({
        variables: {
          id: voteId,
        },
      });
      toast("Your vote was removed successfully!");

      return;
    }
    // upvote exists, but the user want to downvote ...  so we modify the existing row in the votes table
    else if (vote === true && typeOfVote === false) {
      toast("Changing your upvote to downvote");
      await modifyVote({
        variables: {
          id: voteId,
          typeOfVote: typeOfVote,
        },
      });
      toast("Changed to Downvote!");
    }
    // vote exists as a downvote but the user wants to change to upvote , so modify the row in the vote table
    else if (vote === false && typeOfVote === true) {
      toast("Changing your Downvote to Upvote!");
      await modifyVote({
        variables: {
          id: voteId,
          typeOfVote: typeOfVote,
        },
      });
      toast("Changed to Upvote!");
    } else {
      toast("Inserting your Vote!");
      const {
        data: { insertVote: newVote },
      } = await addVote({
        variables: {
          post_id: post?.id,
          username: session?.user?.name,
          upvote: typeOfVote,
        },
      });
      toast("Your vote was inserted!");
    }
  };

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVoteUsingPost_id;
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length === 0) return 0;
    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1;
    }
    return displayNumber;
  };

  const editFunction = async () => {
    // check if user is logged in and the post is made by them
    if (!session) toast("Log in to check if this post was made by you!");
    else if (session?.user?.name === post?.username) {
      toast("Taking you to the edit page");
      Router.push(`/post/edit/${post.id}`);
    } else {
      console.log(post);
      console.log("usr", session?.user?.name);
      toast("Try editing a post made by you, and not someone else");
    }
  };

  useEffect(() => {
    const votes: Vote[] = data?.getVoteUsingPost_id;
    const vote = votes?.find(
      (vote) => vote.username === session?.user?.name
    )?.upvote;
    const voteId = votes?.find(
      (vote) => vote.username === session?.user?.name
    )?.id;
    setVote(vote);
    setVoteId(voteId);
  }, [data]);

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    );

  return (
    <Link href={`/post/${post.id}`}>
      <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-600">
        {/* Votes ->lhs */}
        <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
          <ArrowUpIcon
            onClick={() => upVote(true)}
            className={`voteButtons hover:text-blue-400 ${
              vote && "text-blue-400"
            }`}
          />
          <p className="text-xs font-bold text-black">{displayVotes(data)}</p>
          <ArrowDownIcon
            onClick={() => upVote(false)}
            className={`voteButtons hover:text-red-400  ${
              vote === false && "text-red-400"
            }`}
          />
        </div>
        {/* body of post->rhs */}
        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post?.subreddit[0]?.topic} />
            <p className="text-xs text-gray-400">
              <Link href={`/subreddit/${post.subreddit?.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post.subreddit?.topic}
                </span>
              </Link>{" "}
              Posted by u/
              {post.username ? post.username : "Guest"}{" "}
              <TimeAgo date={post.created_at} />
            </p>
          </div>

          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>
          {/* Image */}
          <img className="w-full" src={post.image} alt="" />
          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="postButtons">
              <ChatAltIcon className="h-6 w-6" />
              <p className="hidden sm:inline">
                {post.commentList ? post.commentList.length : 0} Comments
              </p>
            </div>
            <div className="postButtons">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButtons">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButtons">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButtons" onClick={() => editFunction()}>
              <PencilIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Edit</p>
            </div>
            <div className="postButtons">
              <TrashIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Delete</p>
            </div>
            <div className="postButtons">
              <DotsHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Post;
