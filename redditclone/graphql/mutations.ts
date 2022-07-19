import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String!
    $image: String!
    $subreddit_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      subreddit_id: $subreddit_id
      title: $title
      username: $username
    ) {
      body
      created_at
      id
      image
      subreddit_id
      title
      username
    }
  }
`;

export const ADD_SUBREDDIT = gql`
  mutation MyMutation($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation MyMutation($post_id: ID!, $username: String!, $text: String!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
      created_at
      id
      post_id
      text
      username
    }
  }
`;

export const ADD_VOTE = gql`
  mutation MyMutation($post_id: ID!, $username: String!, $upvote: Boolean!) {
    insertVote(post_id: $post_id, username: $username, upvote: $upvote) {
      id
      created_at
      post_id
      upvote
      username
    }
  }
`;

export const REMOVE_VOTE = gql`
  mutation myMutation($id: ID!) {
    deleteVote(id: $id) {
      id
    }
  }
`;

export const MODIFY_VOTE = gql`
  mutation myMutation($id: ID!, $typeOfVote: Boolean!) {
    modifyVote(id: $id, typeOfVote: $typeOfVote) {
      id
    }
  }
`;

export const MODIFY_POST = gql`
    mutation myMutation($id:ID!,$image:String!,$body:String!,$title:String!){
        modifyPost(id:$id,image:$image,body:$body,title:$title){
            id,
            image,
            body,
            title
        }
    }
`;

export const MODIFY_COMMENT = gql`
      mutation myMutation($id:ID!,$text:String!){
            modifyComment(id:$id,text:$text){
              id,
              text
            }
      }
`;