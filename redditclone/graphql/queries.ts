import { gql } from "@apollo/client";

export const GET_SUBREDDIT_BY_TOPIC = gql`
    query MyQuery($topic: String!){
        getSubredditListByTopic(topic: $topic){
            id
            topic
            created_at
        }
    }
`

export const GET_ALL_POSTS = gql`
    query MyQuery{
        getPostList{
            body
            created_at
            id
            image
            username
            subreddit_id
            title
            commentList{
                created_at
                id
                post_id
                text
                username
            }
            subreddit{
                created_at
                id
                topic
            }
            voteList{
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`