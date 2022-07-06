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

type Props = {
  post: Post;
};

const Post = ({ post }: Props) => {
  return (
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
        <div>
          <Avatar seed={post?.subreddit[0]?.topic} />
          <p>
            <span>{post.subreddit[0]?.topic}</span> Posted by u/
            {post.username ? post.username : "Guest"}{" "}
          </p>
        </div>
        {/* Body */}
        {/* Image */}
        {/* Footer */}
      </div>
    </div>
  );
};

export default Post;
