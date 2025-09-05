// types/db.ts
export interface DBPost {
  id: number;
  created_at: string | null;
  title: string | null;
  body: string | null;
  image: string | null;
  username: string | null;
  subreddit_id: number | null;
}

export interface DBComment {
  id: number;
  created_at: string | null;
  post_id: number | null;
  text: string | null;
  username: string | null;
}

export interface DBSubreddit {
  id: number;
  created_at: string | null;
  topic: string | null;
}

export interface DBVote {
  id: number;
  created_at: string | null;
  post_id: number | null;
  upvote: boolean | null;
  username: string | null;
}

/* App types */
export interface Subreddit {
  id: number;
  created_at: string;
  topic: string;
}

export interface Comment {
  id: number;
  created_at: string;
  post_id: number;
  text: string;
  username: string;
}

export interface Vote {
  id: number;
  created_at: string;
  post_id: number;
  upvote: boolean;
  username: string;
}

export interface Post {
  id: number;
  created_at: string;
  title: string;
  body: string;
  image: string;
  username: string;
  subreddit_id: number;
  subreddit?: Subreddit | null;
  commentList?: Comment[];
  votes?: Vote[];
  commentCount?: number;
}

/* Inputs */
export type NewPostInput = {
  title: string;
  body?: string;
  image?: string;
  username: string;
  subreddit_id: number;
};

export type UpdatePostInput = {
  title?: string;
  body?: string;
  image?: string;
};

export type NewCommentInput = {
  post_id: number;
  username: string;
  text: string;
};
