import { gql } from "@apollo/client";

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      created_at
      id
      image
      username
      subreddit_id
      title
      commentList {
        created_at
        id
        post_id
        text
        username
      }
      subreddit {
        created_at
        id
        topic
      }
      voteList {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MYQUERY($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      commentList {
        created_at
        post_id
        text
        username
      }
      created_at
      id
      image
      subreddit {
        created_at
        id
        topic
      }
      title
      subreddit_id
      username
      voteList {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_POSTS_BY_POST_ID = gql`
  query MyQuery($id: ID!) {
    getPost(id: $id) {
      body
      commentList {
        created_at
        id
        post_id
        text
        username
      }
      created_at
      id
      image
      subreddit {
        created_at
        id
        topic
      }
      title
      subreddit_id
      username
      voteList {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_ALL_VOTES_BY_POST_ID = gql`
  query Myquery($id: ID!) {
    getVoteUsingPost_id(id: $id) {
      upvote
      username
      post_id
      id
    }
  }
`;

export const GET_COMMENT_BY__COMMENT_ID = gql`
  query MyQuery($id:ID!){
    getComment(id:$id){
      id
      post_id
      username
      text
    }
  }
`