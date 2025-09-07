// components/Post.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import { Jelly } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { Post as PostType, Vote } from "../types/db";
import { deletePost } from "../services/postService";
import { getVotesByPostId, addVote, updateVote, removeVote } from "../services/voteService";

type Props = { post: PostType | null };

function cleanTopic(topic: string) {
  return topic.replace(/^\/+/, "").trim();
}

export default function Post({ post }: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const [votes, setVotes] = useState<Vote[]>([]);
  const [myVote, setMyVote] = useState<Vote | null>(null);

  const voteTotal = useMemo(() => {
    if (!votes?.length) return 0;
    const total = votes.reduce((acc, v) => acc + (v.upvote ? 1 : -1), 0);
    if (total === 0) return votes[0].upvote ? 1 : -1;
    return total;
  }, [votes]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!post?.id) return;
      const { data } = await getVotesByPostId(post.id);
      if (!mounted) return;
      setVotes(data ?? []);
    })();
    return () => { mounted = false; };
  }, [post?.id]);

  useEffect(() => {
    if (!session?.user?.name) {
      setMyVote(null); return;
    }
    const mine = votes.find((v) => v.username === session.user?.name) ?? null;
    setMyVote(mine);
  }, [votes, session?.user?.name]);

  const upVote = async (up: boolean) => {
    if (!session?.user?.name || !post?.id) {
      toast("Hey, You need to sign in to be able to vote!"); return;
    }

    if (myVote && myVote.upvote === up) {
      toast(up ? "Removing your Upvote!" : "Removing your Downvote");
      await removeVote(myVote.id);
    } else if (myVote && myVote.upvote !== up) {
      toast(up ? "Changing your Downvote to Upvote!" : "Changing your Upvote to Downvote");
      await updateVote(myVote.id, up);
    } else {
      toast("Inserting your Vote!");
      await addVote({ post_id: post.id, username: session.user.name, upvote: up });
    }

    const { data } = await getVotesByPostId(post.id);
    setVotes(data ?? []);
  };

  const onEdit = () => {
    if (!session) { toast("Log in to check if this post was made by you!"); return; }
    if (session.user?.name === post?.username) { toast("Taking you to the edit page"); router.push(`/post/edit/${post?.id}`); }
    else toast("Try editing a post made by you, and not someone else");
  };

  const deleteThisPost = async () => {
    if (!post?.id) {
      toast.error("No post to delete");
      setModalIsOpen(false);
      return;
    }
    const { error } = await deletePost(post.id);
    setModalIsOpen(false);
    if (error) {
      toast.error("Failed to delete post");
      return;
    }
    toast.success("Post was deleted");
    router.push("/");
  };
  

  if (!post) return (<div className="flex w-full items-center justify-center p-10 text-xl"><Jelly size={50} color="#FF4501" /></div>);
  const safeTopic = cleanTopic(post.subreddit?.topic ?? "");

  return (
    <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-600" onClick={() => router.push(`/post/${post.id}`)}>
      <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
        <ArrowUpIcon onClick={(e) => { e.stopPropagation(); void upVote(true); }} className={`voteButtons hover:text-blue-400 ${myVote?.upvote ? "text-blue-400" : ""}`} />
        <p className="text-xs font-bold text-black">{voteTotal}</p>
        <ArrowDownIcon onClick={(e) => { e.stopPropagation(); void upVote(false); }} className={`voteButtons hover:text-red-400 ${myVote && !myVote.upvote ? "text-red-400" : ""}`} />
      </div>

      <div className="p-3 pb-1 flex-1">
        <div className="flex items-center space-x-2">
          <Avatar seed={safeTopic} />
          <p className="text-xs text-gray-400">
            <span onClick={(e) => { e.stopPropagation(); router.push(`/subreddit/${safeTopic}`); }} className="font-bold text-black hover:text-blue-400 hover:underline cursor-pointer">r/{safeTopic}</span>{" "}
            <span onClick={(e) => { e.stopPropagation(); router.push(`/user/${post?.username}`); }} className="hover:text-blue-400 hover:underline cursor-pointer" >
            Posted by u/{post.username ?? "Guest"}</span> <TimeAgo date={post.created_at ?? ""} />
          </p>
        </div>

        <div className="py-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="mt-2 text-sm font-light">{post.body}</p>
        </div>

        {post.image && <img className="w-full" src={post.image} alt="" />}

        <div className="flex flex-wrap space-x-1 text-gray-400 items-center min-w-0">
          <div className="postButtons flex justify-start" onClick={(e) => { e.stopPropagation(); router.push(`/post/${post.id}`); }}>
            <ChatAltIcon className="h-6 w-6" />
            <p className="flex justify-start object-cover whitespace-nowrap">{post.commentList ? post.commentList.length : 0} Comments</p>
          </div>
          <div className="postButtons"><GiftIcon className="h-6 w-6" /><p className="hidden sm:inline">Award</p></div>
          <div className="postButtons"><ShareIcon className="h-6 w-6" /><p className="hidden sm:inline">Share</p></div>
          <div className="postButtons"><BookmarkIcon className="h-6 w-6" /><p className="hidden sm:inline">Save</p></div>
          <div className="postButtons" onClick={(e) => { e.stopPropagation(); onEdit(); }}><PencilIcon className="h-6 w-6" /><p className="hidden sm:inline">Edit</p></div>
          <div
          className="postButtons"
          onClick={(e) => {
            e.stopPropagation();
            if (post && session && session.user?.name === post.username) {
              setModalIsOpen(true);
            } else {
              toast("You aren't the author of this post, so can't delete this one...");
            }
          }}
        >
          <TrashIcon className="h-6 w-6" />
          <p className="hidden sm:inline">Delete</p>
        </div>
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={{
            overlay: { backgroundColor: "rgba(255,255,255,0.75)", zIndex: 100 },
            content: { position:"absolute",top: "50%", left: "50%",right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)', zIndex: 100, width: "75%", height: "50%", borderRadius: "15px", border: "1px solid #ccc", background: "#fff", overflow: "auto", WebkitOverflowScrolling: "touch", outline: "none", padding: "10%" }, 
          }}>
            <div className="flex flex-col items-center justify-center mt-11">
              <p className="text-xl">Are you sure you want to delete?</p>
              <div className="flex flex-row justify-evenly mt-2">
              <button
  className="w-14 h-7 bg-teal-400 rounded-full mr-4 text-white"
  onClick={deleteThisPost}
>
  Yes
</button>
<button className="w-14 h-7 bg-blue-700 rounded-full text-white" onClick={() => setModalIsOpen(false)}>No</button>
              </div>
            </div>
          </Modal>

          <div className="postButtons"><DotsHorizontalIcon className="h-6 w-6" /></div>
        </div>
      </div>
    </div>
  );
}
