import React from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import Link from "next/link";
import {Jelly} from '@uiball/loaders';


type Props = {
  post: Post;
};

const Post = ({ post }: Props) => {
  console.log(post);
  if(!post)return (
    <div className="flex w-full items-center justify-center p-10 text-xl">
      <Jelly size={50} color="#FF4501"/>
    </div>
  )
  return (
    <Link href={`/post/${post.id}`}>
      <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-600">
        {/* Votes ->lhs */}
        <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
          <ArrowUpIcon className="voteButtons hover:text-red-400" />
          <p className="text-xs font-bold text-black">0</p>
          <ArrowDownIcon className="voteButtons hover:text-blue-400" />
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
              </Link>
              {" "}Posted by u/
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
            <div className="postButton">
              <ChatAltIcon className="h-6 w-6" />
              <p className="hidden sm:inline">
                {post.commentList ? post.commentList.length : 0} Comments
              </p>
            </div>
            <div className="postButton">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButton">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButton">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButton">
              <DotsHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Post;
