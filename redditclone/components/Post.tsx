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

type Props = {
  post: Post;
};

const Post = ({ post }: Props) => {
  return (
    <div>
      {/* Votes ->lhs */}
      <div>
        <ArrowUpIcon className="voteButtons hover:text-red-400"/>
        <p>0</p>
        <ArrowDownIcon className="voteButtons hover:text-blue-400"/>
      </div>
      {/* body of post->rhs */}
      <div>
        {/* Header */}

        {/* Body */}
        {/* Image */}
        {/* Footer */}
      </div>
    </div>
  );
};

export default Post;
