import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from "../graphql/queries";
import Post from "../components/Post";

type Props = {
  topic?: string;
};

const Feed = ({ topic }: Props) => {
  const { data, error } = !topic
    ? useQuery(GET_ALL_POSTS)
    : useQuery(GET_ALL_POSTS_BY_TOPIC, {
        variables: {
          topic: topic,
        },
      });
  const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic;
  // console.log(data);
  // console.log(error);
  return (
    <div className="mt-5 space-y-4">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
